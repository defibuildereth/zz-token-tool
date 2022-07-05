import React from 'react';

const BalancesTable = ({ balances }) => {

    let retrievedBalances = balances

    const parseBalances = function (obj) {
        let keys = Object.keys(obj)
        let addressObject = (obj[keys[0]])
        const nodes = addressObject.map(item => {
            let address = Object.keys(addressObject[0])[0]
            let networks = Object.values(item)[0]
            return networks.map((n) => {
                let network = Object.keys(n)[0]
                let tokenBalances = Object.values(n)[0]
                return tokenBalances.map((token) => {
                    return <tr>
                        <td>{address}</td>
                        <td>{network}</td>
                        <td>{token.token}</td>
                        <td>{token.balance}</td>
                        <td></td>
                        <td></td>
                    </tr>
                })
            })
        })
        return nodes
    }

    return (<>
        <h3>I are balance table</h3>
        <table>
            <tr>
                <th>Address</th>
                <th>Network</th>
                <th>Token</th>
                <th>Balance</th>
                <th>Price</th>
                <th>Value</th>
            </tr>
            {parseBalances(retrievedBalances)}
        </table>
    </>)
}

export default BalancesTable