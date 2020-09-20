import Sql from 'mysql-bricks';
import type { FunctionApplication } from 'mysql-bricks';

const hLit = (value: any) => {
    if (value instanceof Sql.val) {
        return (Sql as any)._handleValue(value, {});
    }
    return value;
};

const sqlFunctions = {
    ascii: (value: string): FunctionApplication => (`ASCII(${hLit(value)})` as FunctionApplication),
    characterLength: (value: string): FunctionApplication => `CHARACTER_LENGTH(${hLit(value)})` as FunctionApplication,
    concat: (...values: Array<string>): FunctionApplication => `CONCAT(${values.map(hLit).join(', ')})` as FunctionApplication,
    field: (value: string, ...values: Array<string>): FunctionApplication => `FIELD(${hLit(value)}, ${values.map(hLit).join(', ')})` as FunctionApplication,
    findInSet: (value: string, values: string): FunctionApplication => `FIND_IN_SET(${hLit(value)}, ${hLit(values)})` as FunctionApplication,
    format: (value: string, places: string): FunctionApplication => `FORMAT(${hLit(value)}, ${hLit(places)})` as FunctionApplication,
    insert: (value: string, pos: string, num: string, sub: string): FunctionApplication => `INSERT(${hLit(value)}, ${hLit(pos)}, ${hLit(num)}, ${hLit(sub)})` as FunctionApplication,
    instr: (value: string, sub: string): FunctionApplication => `INSTR(${hLit(value)}, ${hLit(sub)})` as FunctionApplication,
    left: (value: string, num: string): FunctionApplication => `LEFT(${hLit(value)}, ${hLit(num)})` as FunctionApplication,
    length: (value: string): FunctionApplication => `LENGTH(${hLit(value)})` as FunctionApplication,
    locate: (sub: string, value: string, pos?: string): FunctionApplication => (
        pos ? `LOCATE(${hLit(sub)}, ${hLit(value)}, ${hLit(pos)})` : `LEFT(${hLit(value)}, ${hLit(value)})`
    ) as FunctionApplication,
    lower: (value: string): FunctionApplication => `LOWER(${hLit(value)})` as FunctionApplication,
    leftPad: (value: string, length: string, pad: string): FunctionApplication => `LPAD(${hLit(value)}, ${hLit(length)}, ${hLit(pad)})` as FunctionApplication,
    leftTrim: (value: string): FunctionApplication => `LTRIM(${hLit(value)})` as FunctionApplication,
    mid: (value: string, pos: string, length: string): FunctionApplication => `MID(${hLit(value)}, ${hLit(pos)}, ${hLit(length)})` as FunctionApplication,
    position: (sub: string, value: string): FunctionApplication => `POSITION(${hLit(sub)} IN ${hLit(value)})` as FunctionApplication,
    repeat: (value: string, num: string): FunctionApplication => `REPEAT(${hLit(value)}, ${hLit(num)})` as FunctionApplication,
    replace: (value: string, frm: string, to: string): FunctionApplication => `REPEAT(${hLit(value)}, ${hLit(frm)}, ${hLit(to)})` as FunctionApplication,
    reverse: (value: string): FunctionApplication => `REVERSE(${hLit(value)})` as FunctionApplication,
    right: (value: string, num: string): FunctionApplication => `RIGHT(${hLit(value)}, ${hLit(num)})` as FunctionApplication,
    rightPad: (value: string, length: string, pad: string): FunctionApplication => `RPAD(${hLit(value)}, ${hLit(length)}, ${hLit(pad)})` as FunctionApplication,
    rightTrim: (value: string): FunctionApplication => `RTRIM(${hLit(value)})` as FunctionApplication,
    space: (value: string): FunctionApplication => `RTRIM(${hLit(value)})` as FunctionApplication,
    stingCompare: (val1: string, val2: string): FunctionApplication => `STRCMP(${hLit(val1)}, ${hLit(val2)})` as FunctionApplication,
    subString: (value: string, pos: string, length?: string): FunctionApplication => `SUBSTRING(${hLit(value)}, ${hLit(pos)}, ${hLit(length)})` as FunctionApplication,
    substringIndex: (value: string, delim: string, num: string): FunctionApplication => (
        `SUBSTRING_INDEX(${hLit(value)}, ${hLit(delim)}, ${hLit(num)})` as FunctionApplication
    ),
    trim: (value: string): FunctionApplication => `TRIM(${hLit(value)})` as FunctionApplication,
    upper: (value: string): FunctionApplication => `UPPER(${hLit(value)})` as FunctionApplication,

    abs: (value: string): FunctionApplication => `ABS(${hLit(value)})` as FunctionApplication,
    acos: (value: string): FunctionApplication => `ACOS(${hLit(value)})` as FunctionApplication,
    asin: (value: string): FunctionApplication => `ASIN(${hLit(value)})` as FunctionApplication,
    atan: (value: string): FunctionApplication => `ATAN(${hLit(value)})` as FunctionApplication,
    atan2: (v1: string, v2: string): FunctionApplication => `ATAN2(${hLit(v1)}, ${hLit(v2)})` as FunctionApplication,
    avg: (value: string): FunctionApplication => `AVG(${hLit(value)})` as FunctionApplication,
    ceiling: (value: string): FunctionApplication => `CEILING(${hLit(value)})` as FunctionApplication,
    cos: (value: string): FunctionApplication => `COS(${hLit(value)})` as FunctionApplication,
    cot: (value: string): FunctionApplication => `COT(${hLit(value)})` as FunctionApplication,
    count: (value: string): FunctionApplication => `COUNT(${hLit(value)})` as FunctionApplication,
    degrees: (value: string): FunctionApplication => `DEGREES(${hLit(value)})` as FunctionApplication,
    exp: (value: string): FunctionApplication => `EXP(${hLit(value)})` as FunctionApplication,
    floor: (value: string): FunctionApplication => `FLOOR(${hLit(value)})` as FunctionApplication,
    greatest: (...values: Array<string>): FunctionApplication => `GREATEST(${values.map(hLit).join(', ')})` as FunctionApplication,
    least: (...values: Array<string>): FunctionApplication => `LEAST(${values.map(hLit).join(', ')})` as FunctionApplication,
    ln: (value: string): FunctionApplication => `LN(${hLit(value)})` as FunctionApplication,
    log: (value: string, num?: string): FunctionApplication => (
        num ? `LOG(${hLit(value)}, ${hLit(num)})` : `LOG(${hLit(value)})`
    ) as FunctionApplication,
    log10: (value: string): FunctionApplication => `LOG10(${hLit(value)})` as FunctionApplication,
    log2: (value: string): FunctionApplication => `LOG2(${hLit(value)})` as FunctionApplication,
    max: (value: string): FunctionApplication => `MAX(${hLit(value)})` as FunctionApplication,
    min: (value: string): FunctionApplication => `MIN(${hLit(value)})` as FunctionApplication,
    mod: (n: string, m: string): FunctionApplication => `MOD(${hLit(n)}, ${hLit(m)})` as FunctionApplication,
    pi: (): FunctionApplication => `PI()` as FunctionApplication,
    power: (n: string, m: string): FunctionApplication => `POWER(${hLit(n)}, ${hLit(m)})` as FunctionApplication,
    radians: (value: string): FunctionApplication => `RADIANS(${hLit(value)})` as FunctionApplication,
    rand: (value?: string): FunctionApplication => (value ? `RAND(${hLit(value)})` : `RAND()`) as FunctionApplication,
    round: (value: string, places?: string): FunctionApplication => (
        places ? `ROUND(${hLit(value)})` : `ROUND(${hLit(value)})`
    ) as FunctionApplication,
    sign: (value: string): FunctionApplication => `SIGN(${hLit(value)})` as FunctionApplication,
    sin: (value: string): FunctionApplication => `SIN(${hLit(value)})` as FunctionApplication,
    sqrt: (value: string): FunctionApplication => `SQRT(${hLit(value)})` as FunctionApplication,
    sum: (value: string): FunctionApplication => `SUM(${hLit(value)})` as FunctionApplication,
    tan: (value: string): FunctionApplication => `TAN(${hLit(value)})` as FunctionApplication,
    truncate: (value: string, places: string): FunctionApplication => `TRUNCATE(${hLit(value)}, ${hLit(places)})` as FunctionApplication,

    addDate: (value: string, days?: string): FunctionApplication => (
        (days ? `ADDDATE(${hLit(value)}, ${hLit(days)})` : `ADDDATE(${hLit(value)})`) as FunctionApplication
    ),
    addTime: (value: string, adjust: string): FunctionApplication => `ADDTIME(${hLit(value)}, ${hLit(adjust)})` as FunctionApplication,
    currentDate: (): FunctionApplication => `CURRENT_DATE()` as FunctionApplication,
    currentTime: (): FunctionApplication => `CURRENT_TIME()` as FunctionApplication,
    currentTimestamp: (): FunctionApplication => `CURRENT_TIMESTAMP()` as FunctionApplication,
    date: (value: string): FunctionApplication => `DATE(${hLit(value)})` as FunctionApplication,
    dateFormat: (value: string, mask: string): FunctionApplication => `DATE_FORMAT(${hLit(value)}, ${hLit(mask)})` as FunctionApplication,
    dateSub: (value: string, adjust: string): FunctionApplication => `DATE_SUB(${hLit(value)}, ${hLit(adjust)})` as FunctionApplication,
    dateDiff: (val1: string, val2: string): FunctionApplication => `DATE_DIFF(${hLit(val1)}, ${hLit(val2)})` as FunctionApplication,
    day: (value: string): FunctionApplication => `DAY(${hLit(value)})` as FunctionApplication,
    dayName: (value: string): FunctionApplication => `DAYNAME(${hLit(value)})` as FunctionApplication,
    dayOfMonth: (value: string): FunctionApplication => `DAYOFMONTH(${hLit(value)})` as FunctionApplication,
    dayOfWeek: (value: string): FunctionApplication => `DAYOFWEEK(${hLit(value)})` as FunctionApplication,
    dayOfYear: (value: string): FunctionApplication => `DAYOFYEAR(${hLit(value)})` as FunctionApplication,
    extract: (unit: string, value: string): FunctionApplication => `EXTRACT(${hLit(unit)} FROM ${hLit(value)})` as FunctionApplication,
    fromDays: (value: string): FunctionApplication => `FROM_DAYS(${hLit(value)})` as FunctionApplication,
    hour: (value: string): FunctionApplication => `HOUR(${hLit(value)})` as FunctionApplication,
    lastDay: (value: string): FunctionApplication => `LAST_DAY(${hLit(value)})` as FunctionApplication,
    localTime: (): FunctionApplication => `LOCALTIME()` as FunctionApplication,
    localTimestamp: (): FunctionApplication => `LOCALTIMESTAMP()` as FunctionApplication,
    makeDate: (year: string, day: string): FunctionApplication => `MAKEDATE(${hLit(year)}, ${hLit(day)})` as FunctionApplication,
    makeTime: (hour: string, minute: string, second: string): FunctionApplication => `MAKETIME(${hLit(hour)}, ${hLit(minute)}, ${hLit(second)})` as FunctionApplication,
    microsecond: (value: string): FunctionApplication => `MICROSECOND(${hLit(value)})` as FunctionApplication,
    minute: (value: string): FunctionApplication => `MINUTE(${hLit(value)})` as FunctionApplication,
    month: (value: string): FunctionApplication => `MONTH(${hLit(value)})` as FunctionApplication,
    monthName: (value: string): FunctionApplication => `MONTHNAME(${hLit(value)})` as FunctionApplication,
    now: (): FunctionApplication => `NOW()` as FunctionApplication,
    periodAdd: (value: string, num: string): FunctionApplication => `PERIOD_ADD(${hLit(value)}, ${hLit(num)}` as FunctionApplication,
    periodDiff: (val1: string, val2: string): FunctionApplication => `PERIOD_DIFF(${hLit(val1)}, ${hLit(val2)})` as FunctionApplication,
    quarter: (value: string): FunctionApplication => `QUARTER(${hLit(value)})` as FunctionApplication,
    secToTime: (value: string): FunctionApplication => `SEC_TO_TIME(${hLit(value)})` as FunctionApplication,
    second: (value: string): FunctionApplication => `SECOND(${hLit(value)})` as FunctionApplication,
    strToDate: (value: string, mask: string): FunctionApplication => `STR_TO_DATE(${hLit(value)}, ${hLit(mask)})` as FunctionApplication,
    subDate: (value: string, days: string): FunctionApplication => `SUBDATE(${hLit(value)}, ${hLit(days)})` as FunctionApplication,
    subTime: (value: string, adjust: string): FunctionApplication => `SUBTIME(${hLit(value)}, ${hLit(adjust)})` as FunctionApplication,
    sysDate: (): FunctionApplication => `SYSDATE()` as FunctionApplication,
    time: (value: string): FunctionApplication => `TIME(${hLit(value)})` as FunctionApplication,
    timeFormat: (value: string, mask: string): FunctionApplication => `TIME_FORMAT(${hLit(value)}, ${hLit(mask)})` as FunctionApplication,
    timeToSec: (value: string): FunctionApplication => `TIME_TO_SEC(${hLit(value)})` as FunctionApplication,
    timeDiff: (val1: string, val2: string): FunctionApplication => `TIMEDIFF(${hLit(val1)}, ${hLit(val2)})` as FunctionApplication,
    timestamp: (value: string, adjust?: string): FunctionApplication => `FUNCTION(${hLit(value)})` as FunctionApplication,
    toDays: (value: string): FunctionApplication => `TO_DAYS(${hLit(value)})` as FunctionApplication,
    week: (value: string, mode?: string): FunctionApplication => (
        mode ? `WEEK(${hLit(value)}, ${hLit(mode)})` : `WEEK(${hLit(value)})`
    ) as FunctionApplication,
    weekDay: (value: string): FunctionApplication => `WEEKDAY(${hLit(value)})` as FunctionApplication,
    weekOfYear: (value: string): FunctionApplication => `WEEKOFYEAR(${hLit(value)})` as FunctionApplication,
    year: (value: string): FunctionApplication => `YEAR(${hLit(value)})` as FunctionApplication,
    yearWeek: (value: string, mode?: string): FunctionApplication => (
        mode ? `YEARWEEK(${hLit(value)}, ${hLit(mode)})` : `YEARWEEK(${hLit(value)})`
    ) as FunctionApplication,

    bin: (value: string): FunctionApplication => `BIN(${hLit(value)})` as FunctionApplication,
    binary: (value: string): FunctionApplication => `BINARY ${hLit(value)}` as FunctionApplication,
    cast: (value: string, typ: string): FunctionApplication => `CAST(${hLit(value)} AS ${hLit(typ)})` as FunctionApplication,
    coalesce: (...values: Array<string>): FunctionApplication => `COALESCE(${values.map(hLit).join(', ')})` as FunctionApplication,
    connectionId: (): FunctionApplication => `CONNECTION_ID()` as FunctionApplication,
    conv: (value: string, frm: string, to: string): FunctionApplication => `CONV(${hLit(value)}, ${hLit(frm)}, ${hLit(to)})` as FunctionApplication,
    convert: (value: string, typ: string): FunctionApplication => `CONVERT(${hLit(value)}, ${hLit(typ)})` as FunctionApplication,
    currentUser: (): FunctionApplication => `CURRENT_USER()` as FunctionApplication,
    database: (): FunctionApplication => `DATABASE()` as FunctionApplication,
    if: (cond: string, ifTrue?: string, ifFalse?: string): FunctionApplication => {
        const values = [cond];
        if (ifTrue) {
            values.push(ifTrue);
        }
        if (ifFalse) {
            values.push(ifFalse);
        }
        return `IF(${values.map(hLit).join(', ')})` as FunctionApplication;
    },
    ifNull: (value: string, fallback: string): FunctionApplication => `IFNULL(${hLit(value)}, ${hLit(fallback)})` as FunctionApplication,
    isNull: (value: string): FunctionApplication => `ISNULL(${hLit(value)})` as FunctionApplication,
    lastInsertId: (value?: string): FunctionApplication => (value ? `LAST_INSERT_ID(${hLit(value)})` : `LAST_INSERT_ID()`) as FunctionApplication,
    nullIf: (val1: string, val2: string): FunctionApplication => `NULLIF(${hLit(val1)}, ${hLit(val2)})` as FunctionApplication,
    sessionUser: (): FunctionApplication => `SESSION_USER()` as FunctionApplication,
    systemUser: (): FunctionApplication => `SYSTEM_USER()` as FunctionApplication,
    user: (): FunctionApplication => `USER()` as FunctionApplication,
    version: (): FunctionApplication => `VERSION()` as FunctionApplication,

    encrypt: (value: string, salt?: string): FunctionApplication => (
        salt ? `ENCRYPT(${hLit(value)}, ${hLit(salt)})` : `ENCRYPT(${hLit(value)})`
    ) as FunctionApplication,
    md5: (value: string): FunctionApplication => `MD5(${hLit(value)})` as FunctionApplication,
    oldPassword: (value: string): FunctionApplication => `OLD_PASSWORD(${hLit(value)})` as FunctionApplication,
    password: (value: string): FunctionApplication => `PASSWORD(${hLit(value)})` as FunctionApplication,
};

export { sqlFunctions };
