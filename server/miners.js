const minersData = {
    miner1: { values: [] },
    miner2: { values: [] },
    miner3: { values: [] },
    miner4: { values: [] }
};

const updateValues = () => {
    const now = new Date().getTime();

    Object.keys(minersData).forEach((key) => {
        const e = minersData[key];
        const last = e.values.length ? e.values[e.values.length - 1].speed : 10;
        const newv = Math.round(Math.min(30, Math.max(0, last + (Math.random() * 6) - 3)));
        e.values.push({
            date: now,
            speed: newv
        });
    });
}

const getLatest = () => {
  const latest = Object.keys(minersData).reduce((acc, key) => {
    const miner = minersData[key];
    const l = miner.values.length;
    acc[key] = {
      values: miner.values[l - 1]
    }
    return acc
  }, {});
  return latest;
}

const getMiners = () => {
  return minersData;
}

const validateMinerOneLength = () => {
  return minersData.miner1.values.length > 30;
}

module.exports = {
  updateValues,
  getLatest,
  getMiners,
  validateMinerOneLength
}
