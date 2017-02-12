

/**
 * Generate unique message identifier
 *
 * Using simple (aka stackoverflow) guid routine
 *
 * @return {String}
 */
const uniqueId = () => `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;


/**
 * Get random hex number
 *
 * @return {String}
 */
function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

module.exports = uniqueId;