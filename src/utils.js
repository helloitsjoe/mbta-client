// string enum
const TimeUnits = {
  MS: 'MS',
  SECONDS: 'SECONDS',
  MINUTES: 'MINUTES',
  HOURS: 'HOURS',
};

const Attributes = {
  arrival_time: 'arrival_time',
  departure_time: 'departure_time',
};

const convertMs = (ms, units) => {
  if (units == null) return ms;

  const conversionMap = {
    MS: 1,
    SECONDS: 1000,
    MINUTES: 1000 * 60,
    HOURS: 1000 * 60 * 60,
  };
  return ms / conversionMap[units];
};

module.exports = {
  convertMs,
  TimeUnits,
  Attributes,
};
