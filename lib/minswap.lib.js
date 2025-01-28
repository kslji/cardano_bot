function decodeTokenSymbol(encodeString) {
    try {
        return Buffer.from(encodeString, 'hex').toString('utf-8');
    } catch (e) {
        throw e
    }
}
async function getPoolsV2(adapter, page = 1) {
    try {
        const pools = await adapter.getV2Pools({ page });
        const processedPools = pools.pools.map(pool => { return pool });
        return processedPools;
    } catch (e) {
        throw e;
    }
}

async function getPoolsV1(adapter, page = 1) {
    try {
        const pools = await adapter.getV1Pools({ page });
        const processedPools = pools.map(pool => { return pool });
        return processedPools;
    } catch (e) {
        throw e;
    }
}
module.exports = {
    decodeTokenSymbol: decodeTokenSymbol,
    getPoolsV1: getPoolsV1,
    getPoolsV2: getPoolsV2,
}