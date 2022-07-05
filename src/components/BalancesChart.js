import React from 'react';
import { Bar } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

const BalancesChart = ({ balances, prices }) => {
    let retrievedBalances = balances
    let currentPrices = prices

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

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    const labels = tokens.map(item => {
        return item.token
    });

    const makeDatasets = function (obj) {
        let keys = Object.keys(obj)
        let addressObject = (obj[keys[0]])
        let dataArray = []
        addressObject.map(item => {
            let address = Object.keys(item)[0]
            let networks = Object.values(item)[0]
            networks.map((n) => {
                let network = Object.keys(n)[0]
                let tokenBalances = Object.values(n)[0]
                let datas = labels.map(label => {
                    for (let i = 0; i < tokenBalances.length; i++) {
                        if (label == tokenBalances[i].token) {
                            let token = tokenBalances[i]
                            for (let j = 0; j < tokens.length; j++) {
                                if (tokens[j].token == token.token) {
                                    for (let k = 0; k < currentPrices.length; k++) {
                                        if (currentPrices[k].result.tokenSymbol == token.token) {
                                            return token.balance * 10 ** -tokens[j].decimals * Number(currentPrices[k].result.price)
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
                dataArray.push({ label: address.slice(0, 5) + ' ' + network, data: datas, backgroundColor: `#${address.slice(4, 7)}`, stack: network })
            })
        })
        // console.log(dataArray)
        return dataArray

    }

    const data = {
        labels: labels,
        datasets: makeDatasets(retrievedBalances)
    }

    const options = {
        plugins: {
            title: {
                display: true,
                text: 'ZZ token balances'
            },
        },
        responsive: true,
        interaction: {
            intersect: false,
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                title: {
                    display: true,
                    text: '$'
                }
            },

        }
    }

    return (<>
        <Bar options={options} data={data} />
    </>)
}

export default BalancesChart