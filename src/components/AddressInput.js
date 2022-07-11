import React, {useState} from 'react';
import { useForm } from "react-hook-form";


const AddressInput = ({ onFormSubmit, tokens }) => {
    let tokenList = tokens

    const { register, handleSubmit, formState: { errors } } = useForm();

    const [loading, setLoading] = useState("")

    const onSubmit = data => {
        let addresses = Object.values(data)
        const filtered = addresses.filter(n => n)
        onFormSubmit(data)
        getLoading(filtered, tokenList)
        .then(r => {
            setLoading(r)
        })
    };

    const getLoading = async function (addressList, tokens) {
        return ({ addresses: addressList.length, tokens: tokens.length, total: addressList.length * tokens.length })
    }

    return (
        <>
            <form className='addressInput' onSubmit={handleSubmit(onSubmit)}>
                <input className='address' id="add1" size="50" placeholder="Address" {...register("address1", {
                    required: true, pattern: {
                        value: /^0x[a-fA-F0-9]{40}$/,
                        message: "invalid eth address"
                    }
                })} />
                {errors.address && (
                    <span role="alert">
                        Invalid Address
                    </span>
                )}
                <input className='address' id="add2" size="50" placeholder="Address2" {...register("address2", {
                    required: false, pattern: {
                        value: /^0x[a-fA-F0-9]{40}$/,
                        message: "invalid eth address"
                    }
                })} />
                {errors.address && (
                    <span role="alert">
                        Invalid Address
                    </span>
                )}
                <input className='address' id="add3" size="50" placeholder="Address3" {...register("address3", {
                    required: false, pattern: {
                        value: /^0x[a-fA-F0-9]{40}$/,
                        message: "invalid eth address"
                    }
                })} />
                {errors.address && (
                    <span role="alert">
                        Invalid Address
                    </span>
                )}
                <button className="button-36" name="name" value="value" type="submit">Go!</button>
            </form>
            {loading ? <p>Estimated load time = {loading.total / 4}s</p>: null}
        </>
    )
}

export default AddressInput