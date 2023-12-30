
type TPnrProvider = 'amadeus' | 'sabre';

interface IFlightSegment {
  depart_airport: string,
  arrive_airport: string,
  depart_time: string,
  arrive_time: string,
  arrive_date: string,
  depart_date: string,
  airline: string,
  flight_no: string,
}
interface IAgency {
  name: string,
  phone: string,
}
interface IRecordLocator {
  locator: string,
  ticketingInfo: {
    issuingAirline: string,
    issuingDate: string,
    time: string,
    transactionCode: string,
  }
}

interface IPnrResult {
  passengers: string[],
  flightSegments: IFlightSegment[],
  recordLocator: IRecordLocator,
  agency: IAgency,
  ticketStatus?: '',
  ssrMessage?: '',
}

type ParseResult = [string, string | IFlightSegment | IRecordLocator];

function formatDate(date: string) {
  // TODO: implement this?
  return date;
}

function usePNRLineHandler(provider: TPnrProvider): Map<RegExp, (line: string) => ParseResult> {
  const lineParser = new Map();
  // record locator
  // RP/ABCB23129/ABCB23129            EK/RM  26SEP16/1852Z   2B82OU
  lineParser.set(/^RP.+$/, function (line: string) {
    const result = {
      locator: '',
      ticketingInfo: {
        issuingAirline: '',
        issuingDate: '',
        time: '',
        transactionCode: '',
      }
    }
    // split into locatorInfo and ticketingInfo
    const [locatorInfo, ticketingInfo] = line.split(/\s{5,}/);

    result.locator = locatorInfo.split('/')[1];

    const ticketingDetails = ticketingInfo.split(/\s+/);

    result.ticketingInfo.issuingAirline = ticketingDetails[0];
    const [date, time] = ticketingDetails[1].split('/');
    result.ticketingInfo.issuingDate = date;
    result.ticketingInfo.time = time;
    result.ticketingInfo.transactionCode = ticketingDetails[2];

    return ['recordLocator', result];
  })

  // pax line
  // line starts with numeric followed by dot, it is a passenger
  lineParser.set(/^[\s]{0,2}[0-9]{1,2}\.\S+.*/, function (line: string) {
    console.log('line', line);
    // sample pax line:
    // 1.BARNETT/HEATHER JEAN MISS   2.HANKEY/VICTORIA JO ANNE MISS
    const passengers = line.trim().split(/[\s\r\n]*[0-9]{1,2}\./).filter(p => !!p);
    // return key and value
    return ['passengers', passengers];
  });

  // flight segment line
  // sample flight segment
  /*
  // amadeus
    4  QR 905 O 10NOV 5*MELDOH HK3  2100 0325  11NOV  E  QR/5LDY3I
  // sabre
   7 SA 284W 20OCT 7 JNBBOM SS1  1120  0005   21OCT 1 /DCSA /E
   3 EK 359B 30AUG 4 CGKDXB*SS1  0040  0530  /DCEK /E
  * */
  // if flight does not layover till next day, sabre does not repeat segment date, but Amadeus does.
  lineParser.set(/^[0-9]{1,2}[\s]{1,2}.+\s[0-9]{2}[A-Z]{3}\s.+\s[0-9]{4}\s\s?[0-9]{4}\s+([0-9]{2}[A-Z]{3}\s)?.*$/, function (line: string) {

    // amadeus has number, 2 spaces again then flight number
    const isAmadeus = provider === 'amadeus' || /^[0-9]{1,2}\s\s/.test(line);

    // extract departure time, and arrival  time
    const matches = line.match(/[0-9]{4}[\s]{1,2}[0-9]{4}/);
    if (!matches) {
      throw new Error('cant find departure and arrival time for flight segment ' + line);
    }
    // sabre has 2 spaces in between the time
    const [departureTime, arrivalTime] = matches[0].split(/\s{1,2}/);

    // extract airline, flight no
    // amadeus is airline code and number followed by class
    // sabre is all in one
    let airlineCode, airlineNumber;
    if (isAmadeus) {
      const airlineMatches = line.match(/[A-Z0-9]{2}\s?[A-Z0-9]{3,4}\s[A-Z]/)
      if (!airlineMatches) {
        throw new Error('cant find airline for amadeus flight segment' + line);
      }
      const flightNumber = airlineMatches[0];
      [airlineCode, airlineNumber] = [flightNumber.slice(0, 2), flightNumber.slice(0, 6).trim()];

    } else {
      // sabre
      const airlineMatches = line.trim().match(/^[0-9]{1,2}\s[A-Z0-9]{2}\s?[A-Z0-9]{4,5}\s/);
      if (!airlineMatches) {
        throw new Error('cant find airline for sabre flight segment' + line);
      }
      const [index, ...matches] = airlineMatches[0].trim().split(' ');
      const flightNumber = matches.join(' ');
      airlineCode = flightNumber.slice(0, 2);
      airlineNumber = flightNumber.slice(0, -1).trim();
    }

    // extract departure airport and arrival airport
    const dateAndAirportMatch = line.match(/[0-9]{2}[A-Z]{3}\s\d[\s\*][A-Z]{6}/);
    if (!dateAndAirportMatch) {
      throw new Error('cant find departure and arrival airport on flight segment' + line);
    }
    const [departureDate, weekday, airportsPair] = dateAndAirportMatch[0].split(/[\s\*]/);
    const [departureAirport, arrivalAirport] = [airportsPair.slice(0, 3), airportsPair.slice(3)];

    // extract arrival date
    // arrival date is always after dep time and arrival time
    let arrivalDate;
    if (isAmadeus) {
      const flightTimeAndArrivalDateMatch = line.match(/\d{4}\s\d{4}\s{2}\d{2}[A-Z]{3}/);
      if (!flightTimeAndArrivalDateMatch) {
        // may not have arrival date, 
        // set arrival date to be the same as dept date
        // throw new Error('cant find arrival date on flight segment' + line);
        arrivalDate = departureDate;
      }else{
        arrivalDate = flightTimeAndArrivalDateMatch[0].split(/\s\s/).pop();
      }
    } else {
      // sabre may not have arrival date if same day as departure
      const flightTimeAndArrivalDateMatch = line.match(/\d{4}\s\s\d{4}\s{3}\d{2}[A-Z]{3}/);
      if (!flightTimeAndArrivalDateMatch) {
        // if not found for sabre, then set arrival date to be the same as dept date
        arrivalDate = departureDate;
      } else {
        arrivalDate = flightTimeAndArrivalDateMatch[0].split(/\s{3}/).pop();
      }
    }

    return ['flightSegments', {
      depart_airport: departureAirport,
      arrive_airport: arrivalAirport,
      depart_time: departureTime,
      arrive_time: arrivalTime,
      arrive_date: formatDate(arrivalDate as string),
      depart_date: formatDate(departureDate),
      airline: airlineCode,
      flight_no: airlineNumber,
    }]
  });

  // agency line
  // 4 AP MEL +61300888888 - TRAVELS VACATIONS - A
  // if 2 empty space number empty space AP and 2 empty space again, its agent
  lineParser.set(/^\d{1,2}\sAP\s/, function (line: string) {
    // agency name
    // phone
    const [cityAndPhone, agencyName] = line.split(/\s-\s/);
    const phone = cityAndPhone.split(' ').pop();

    return ['agency', {
      name: agencyName,
      phone: phone,
    }];
  });

  // ticket status line

  // ssr message
  return lineParser;

}

export function pnrParser(pnrText: string, provider: TPnrProvider = 'amadeus') {
  if (!pnrText) {
    return;
  }
  const result: IPnrResult = {
    passengers: [],
    flightSegments: [],
    agency: {
      name: '',
      phone: '',
    },
    recordLocator: {
      locator: '',
      ticketingInfo: {
        issuingAirline: '',
        issuingDate: '',
        time: '',
        transactionCode: '',
      }
    },
  };
  const lines = pnrText.split('\n');
  const lineParser = usePNRLineHandler(provider);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    for (let [regex, parse] of lineParser.entries()) {
      if (regex.test(line)) {
        const [key, pnrDetails] = parse(line);

        switch (key) {
          case 'flightSegments':
            result.flightSegments.push(pnrDetails as IFlightSegment);
            break;
          case 'passengers':
            result.passengers = result.passengers.concat(pnrDetails as string);
            break;
          case 'recordLocator':
            result.recordLocator = pnrDetails as IRecordLocator;
            break;
          default:
            break;
        }

        break;
      }
    }
  }
  return result;
}

