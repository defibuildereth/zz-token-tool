import React, { useEffect, useState } from 'react';
import Bottleneck from "bottleneck";
import BalancesChart from '../components/BalancesChart';

const BalanceContainer = () => {

    const etherscanAPI = new Bottleneck({
        maxConcurrent: 1,
        minTime: 250
    });

    const arbiscanAPI = new Bottleneck({
        maxConcurrent: 1,
        minTime: 400
    })

    const polygonscanAPI = new Bottleneck({
        maxConcurrent: 1,
        minTime: 400
    })

    const addressList = [
        '0x4ade2c97eae796bb232026dd1cc1cf98130dbac6',
        // '0x5aa45fa1d7b807f22c677a920afd1e96baf92720',
        '0xAa214bF592687A451A0753F805aa0fe931Ba6968'
    ]

    const tokens = [
        { "token": "ETH", "address": "0x0000000000000000000000000000000000000000", "decimals": 18 },
        { "token": "APE", "address": "0x4d224452801aced8b2f0aebe155379bb5d594381", "decimals": 18 },
        { "token": "BUSD", "address": "0x4fabb145d64652a948d72533023f6e7a623c7c53", "decimals": 18, "polygon-pos": "0xdab529f40e671a1d4bf91361c21bf9f0c9712ab7" },
        { "token": "LINK", "address": "0x514910771af9ca656af840dff83e8264ecf986ca", "decimals": 18, "polygon-pos": "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39", "arbitrum-one": "0xf97f4df75117a78c1a5a0dbb814af92458539fb4" },
        { "token": "DAI", "address": "0x6b175474e89094c44da98b954eedeac495271d0f", "decimals": 18, "polygon-pos": "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063", "arbitrum-one": "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1" },
        { "token": "ENS", "address": "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72", "decimals": 18 },
        { "token": "LDO", "address": "0x5a98fcbea516cf06857215779fd812ca3bef1b32", "decimals": 18, "polygon-pos": "0xc3c7d422809852031b44ab29eec9f1eff2a58756" },
        { "token": "MKR", "address": "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2", "decimals": 18, "arbitrum-one": "0x2e9a6df78e42a30712c10a9dc4b1c8656f8f2879" },
        { "token": "MATIC", "address": "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0", "decimals": 18, "polygon-pos": "0x0000000000000000000000000000000000001010" },
        { "token": "METIS", "address": "0x9e32b13ce7f2e80a01932b42553652e053d6ed8e", "decimals": 18 },
        { "token": "SOL", "address": "0xd31a59c85ae9d8edefec411d448f90841571b89c", "decimals": 9, "polygon-pos": "0xd93f7e271cb87c23aaa73edc008a79646d1f9912" },
        { "token": "STORJ", "address": "0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac", "decimals": 8 },
        { "token": "USDT", "address": "0xdac17f958d2ee523a2206206994597c13d831ec7", "decimals": 6, "polygon-pos": "0xc2132d05d31c914a87c6611c10748aeb04b58e8f", "arbitrum-one": "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9" },
        { "token": "USDC", "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", "decimals": 6, "polygon-pos": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", "arbitrum-one": "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8" },
        { "token": "WETH", "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "decimals": 18, "polygon-pos": "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", "arbitrum-one": "0x82af49447d8a07e3bd95bd0d56f35241523fbab1" },
        { "token": "WBTC", "address": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", "decimals": 8, "polygon-pos": "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6", "arbitrum-one": "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f" },
        { "token": "ZZ", "address": "0xc91a71a1ffa3d8b22ba615ba1b9c01b2bbbf55ad", "decimals": 18 },
    ]

    const [balances, setBalances] = useState("")
    const [loading, setLoading] = useState("")
    const [prices, setPrices] = useState([])

    useEffect(() => {
        getAllBalances(addressList)
            .then((r) => {
                setBalances(r)
            })
        getLoading(addressList, tokens)
            .then((r) => {
                setLoading(r)
            })
        getTokenPrices(tokens)
            .then((r) => {
                console.log(r)
                setPrices(r)
            })
    }, [])

    const getTokenPrices = async function (list) {
        const promiseArray = list.map(item => {
            let url = `https://api.zksync.io/api/v0.2/tokens/${item.token}/priceIn/usd`
            return apiCall(url)
        })

        let prices = await promiseAll(promiseArray)
        // console.log(prices.result.price, prices.result.tokenSymbol)
        return prices
    }

    async function scheduleEtherscan(url) {
        return etherscanAPI.schedule(() => {
            return apiCall(url)
        })
    }

    async function scheduleArbiscan(url) {
        return arbiscanAPI.schedule(() => {
            return apiCall(url)
        })
    }

    async function schedulePolygonscan(url) {
        return polygonscanAPI.schedule(() => {
            return apiCall(url)
        })
    }

    async function apiCall(url) {
        let response = await fetch(url)
        let data = await response.json()
        return data
    }

    async function promiseAll(promises, errors) {
        return Promise.all(promises.map(p => {
            return p.catch(e => {
                errors.push(e.response);
                return null;
            })
        }))
    }

    const getAllBalances = async function (list) {
        const promiseArray = list.map(n => {
            return getAddressBalance(n)
        })

        const allBalances = await promiseAll(promiseArray)
        return { allBalances }
    }

    const getAddressBalance = async function (address) {
        let addressBalancePromiseArray = []

        addressBalancePromiseArray.push(getZkSyncBalance(address))
        addressBalancePromiseArray.push(getMainnetBalance(address))
        addressBalancePromiseArray.push(getArbitrumBalance(address))
        addressBalancePromiseArray.push(getPolygonBalance(address))

        let addressBalances = await promiseAll(addressBalancePromiseArray)

        return ({ [address]: addressBalances });
    }

    const getPolygonBalance = async function (address) {
        let polygonPromiseArray = []
        polygonPromiseArray.push(getPolygonMaticBalance(address))

        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i]['polygon-pos']) {
                if (tokens[i].token !== 'MATIC') {
                    polygonPromiseArray.push(getPolygonERC20Balance(address, tokens[i]['polygon-pos'], tokens[i].token))
                }
            }
        }

        let polygonBalance = await promiseAll(polygonPromiseArray)
        return { polygon: polygonBalance }
    }

    const getPolygonMaticBalance = async function (address) {
        const url = `https://api.polygonscan.com/api?module=account&action=balance&address=${address}&apikey=${process.env.REACT_APP_POLYGONSCAN}`
        const response = await schedulePolygonscan(url)
        return ({ token: 'MATIC', balance: response.result })
    }

    const getPolygonERC20Balance = async function (address, tokenContract, token) {
        const url = `https://api.polygonscan.com/api?module=account&action=tokenbalance&contractaddress=${tokenContract}&address=${address}&tag=latest&apikey=${process.env.REACT_APP_POLYGONSCAN}`
        const response = await schedulePolygonscan(url)
        return ({ token: token, balance: response.result })
    }

    const getArbitrumBalance = async function (address) {
        let arbitrumPromiseArray = []
        arbitrumPromiseArray.push(getArbitrumEthBalance(address))

        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i]['arbitrum-one']) {
                if (tokens[i].token !== 'ETH') {
                    arbitrumPromiseArray.push(getArbitrumERC20Balance(address, tokens[i].address, tokens[i].token))
                }
            }
        }

        let arbitrumBalance = await promiseAll(arbitrumPromiseArray)
        return { arbitrum: arbitrumBalance }
    }

    const getArbitrumEthBalance = async function (address) {
        const url = `https://api.arbiscan.io/api?module=account&action=balance&address=${address}&apikey=${process.env.REACT_APP_ARBISCAN}`
        const response = await scheduleArbiscan(url)
        return ({ token: 'ETH', balance: response.result })
    }

    const getArbitrumERC20Balance = async function (address, tokenContract, token) {
        const url = `https://api.arbiscan.io/api?module=account&action=tokenbalance&contractaddress=${tokenContract}&address=${address}&tag=latest&apikey=${process.env.REACT_APP_ARBISCAN}`
        const response = await scheduleArbiscan(url)
        return ({ token: token, balance: response.result })
    }

    const getMainnetBalance = async function (address) {
        let mainnetPromiseArray = []
        mainnetPromiseArray.push(getMainnetEthBalance(address))

        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].token !== 'ETH') {
                mainnetPromiseArray.push(getMainnetERC20Balance(address, tokens[i].address, tokens[i].token))
            }
        }

        let mainnetBalance = await promiseAll(mainnetPromiseArray)
        return { mainNet: mainnetBalance }

    }

    const getMainnetERC20Balance = async function (address, tokenContract, token) {
        const url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${tokenContract}&address=${address}&tag=latest&apikey=${process.env.REACT_APP_ETHERSCAN}`
        const response = await scheduleEtherscan(url)
        return ({ token: token, balance: response.result })
    }

    const getMainnetEthBalance = async function (address) {
        const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.REACT_APP_ETHERSCAN}`
        const response = await scheduleEtherscan(url)
        return ({ token: 'ETH', balance: response.result })
    }

    const getZkSyncBalance = async function (address) {
        let zkSyncBalance;
        await fetch(`https://api.zksync.io/api/v0.2/accounts/${address}`)
            .then((res) => res.json())
            .then(data => {
                let tokensObject = []
                let keys = Object.keys(data.result.committed.balances)
                let values = Object.values(data.result.committed.balances)
                for (let i = 0; i < keys.length; i++) {
                    tokensObject.push({ token: keys[i], balance: values[i] })
                }
                zkSyncBalance = tokensObject
            })
            .catch((err) => {
                console.log('error', err)
            })
        return ({ zkSync: zkSyncBalance })
    }

    const getLoading = async function (addressList, tokens) {
        return ({ addresses: addressList.length, tokens: tokens.length, total: addressList.length * tokens.length })
    }

    return (<>
        {balances ? <BalancesChart balances={balances} prices={prices}></BalancesChart> : <><p>There are {loading.addresses} addresses and {loading.tokens} relevant tokens, meaning {loading.total} Etherscan API calls (less for Arbiscan and PolygonScan).</p><p> At 4 calls/second, that means a loading time of {loading.total / 4}s.</p></>}
    </>)
}

export default BalanceContainer