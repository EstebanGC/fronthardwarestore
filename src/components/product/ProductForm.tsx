import React, {useState, useEffect } from "react";
import { useAppDispatch } from "../../state/store";
import { providerTp, selectProvState } from "../../state/slices/providerSlice";
import { productTp } from "../../state/slices/productSlice";
import { useSelector } from "react-redux";
import { getProviders } from "../../actions/Provider/getProviders";
import { nanoid } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../actions/Product/createProduct";


interface ProductFormProps {}

const ProductForm: React.FunctionComponent<ProductFormProps> = (props) => {
    const [productName,setProductName] = useState("")
    const [productPrice, setProductPrice] = useState(0)
    const [productDescription,setProductDescription] = useState("")
    const [minUnits, setMinUnits] = useState(0)
    const [maxUnits, setMaxUnits] = useState(0)
    const [providers, setProvider] = useState({} as providerTp)

    const dispatch = useAppDispatch()

    let navigate = useNavigate();


    useEffect(() => {dispatch(getProviders())}, [dispatch] )

    const onAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(productName&&productPrice&&productDescription&&minUnits&&maxUnits&&providers&&(productPrice>0&&minUnits>=0)&&(minUnits<maxUnits)){
            const addProduct: productTp = {
                id: nanoid(),
                productName: productName,
                productPrice: productPrice,
                productDescription: productDescription,
                sold: 0,
                minUnits: minUnits,
                maxUnits: maxUnits,
                availableUnits: 0,
                providers: providers
            }
            dispatch(createProduct(addProduct))
            navigate("/Inventory")
        } else {
            alert("All fields have to be filled, the values have to be positive and minimum units have to be less than maximum units")
         }
        }

        const getProvs = useSelector(selectProvState())

        const selectProvOnList = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setProvider(getProvs.filter((providers) => providers.id === e.target.value) [0])
        }

        return (
            <div>
                <form className="product-form" id="addProduct" onSubmit={(e) => onAdd(e)}>
                <label >Product name</label>
                <input type="text" id="product-name" placeholder="Product name..." onChange={(e) => setProductName(e.target.value)}/>
                <label >Price</label>
                <input type="number" id="product-price" placeholder="Product price.." onChange={(e) => setProductPrice(Number(e.target.value))}/>
                <label >Price</label>
                <input type="text" min="0" id="product-description" placeholder="Product description..." onChange={(e) => setProductDescription(e.target.value)}/>
                <label >Alert of low stock</label>
                <input type="number" min="0" id="min-units" placeholder="Minimum units..." onChange={(e) => setMinUnits(Number(e.target.value))}/>
                <label >Maximum Stock</label>
                <input type="number" min="0" id="max-units" placeholder="Maximum units..." onChange={(e) => setMaxUnits(Number(e.target.value))}/>
                <label >Select a provider</label>
                <select id="providers" name="providers" onChange={(e) => selectProvOnList(e)}>
                    <option disabled selected> Select a provider </option>
                    {getProvs.map((provider) => <option key={provider.id} value={provider.id}>
                        {provider.providerName}
                    </option>)}
                </select>
                <input type="submit" value="Submit" />
                <br />
                <br />
                <button className='button3' onClick={() => navigate("/Inventory")}>Go Back</button><br />

                </form>
            </div>
        )
    }

    export default ProductForm