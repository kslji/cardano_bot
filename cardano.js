import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import { BlockfrostAdapter, NetworkId, Asset } from "@minswap/sdk";
import globalConfig from './global.config.json' assert { type: 'json' };

function decodeTokenSymbol(encodeString) {
    try {
        return Buffer.from(encodeString, 'hex').toString('utf-8');
    } catch (e) {
        throw e
    }
}

async function getTokenFullName(token) {
    try {
        let iterPools = 0
        while (true) {
            const blockFrostApi = new BlockFrostAPI({
                projectId: globalConfig.APIS[iterPools % globalConfig.APIS.length],
                network: globalConfig.NETWORK,
            });

            const adapter = new BlockfrostAdapter({
                networkId: NetworkId.MAINNET,
                blockFrost: blockFrostApi,
            });
            const pools = await adapter.getV2Pools({ page: iterPools });
            const getPoolData = pools.pools.find(
                (pool) => pool.datum.assetB.policyId === token
            );
            if (getPoolData) {
                return {
                    symbol: decodeTokenSymbol(getPoolData.datum.assetB.tokenName),
                    tokenNumber: getPoolData.datum.assetB.tokenName,
                    reserve0: Number(getPoolData.datum.reserveA),
                    reserve1: Number(getPoolData.datum.reserveA),
                    feeANumerator: Number(getPoolData.datum.baseFee.feeANumerator),
                    feeBNumerator: Number(getPoolData.datum.baseFee.feeBNumerator),
                    feeSharingNumerator: Number(getPoolData.datum.feeSharingNumerator),
                    totalLiquidity: Number(getPoolData.datum.totalLiquidity),
                }
            }
            iterPools++;
        }
    } catch (e) {
        throw e;
    }
}

async function getTokenPrice(token) {
    try {
        const blockFrostApi = new BlockFrostAPI({
            projectId: globalConfig.APIS[Math.floor(Math.random() * globalConfig.APIS.length)],
            network: globalConfig.NETWORK,
        });

        const adapter = new BlockfrostAdapter({
            networkId: NetworkId.MAINNET,
            blockFrost: blockFrostApi,
        });
        const tokendetails = await getTokenFullName(token)
        const minAdaPool = await adapter.getV2PoolByPair(
            Asset.fromString(globalConfig.CARDANO_GAS),
            Asset.fromString(token + tokendetails.tokenNumber)
        );
        if (minAdaPool) {
            const [priceInAda, priceInUsd] = await adapter.getV2PoolPrice({ pool: minAdaPool });
            console.log({
                SYMBOL: tokendetails.symbol,
                USD: priceInUsd.toString(),
                ADA: priceInAda.toString(),
            })
        }
    } catch (e) {
        throw e
    }
}
// getTokenPrice("5d16cc1a177b5d9ba9cfa9793b07e60f1fb70fea1f8aef064415d114")