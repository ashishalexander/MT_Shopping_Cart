import { useState } from "react"

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

function App() {
  const[cart,setCart] = useState([])
  const[quantities,setQuantities] = useState({})

  const handleIncrement =(productId)=>{
    setQuantities((prev)=>({
      ...prev,
      [productId]: (prev[productId] || 0)+1
    }))
  }

  const handleDecrement = (productId)=>{
    setQuantities((prev)=>({
      ...prev,
      [productId]:Math.max((prev[productId] ||0)-1,0)
    }))
  }
  const addToCart =(product)=>{
    const quantityToAdd = quantities[product.id] ||0
    if(quantityToAdd === 0) return

    setCart((prevCart)=>{
      const exists = prevCart.find((item)=>item.id === product.id)
      if(exists){
        return prevCart.map((item)=> item.id === product.id ? {...item,quantity: item.quantity+quantityToAdd}:item)
      }else{
        return [...prevCart,{...product,quantity:quantityToAdd}]
      }
    })

    setQuantities((prev)=>({...prev,[product.id]:0}))
  }

  const incrementCartItem = (productId)=>{
    setCart((prevCart)=>prevCart.map((item)=>item.id === productId?{...item,quantity:item.quantity+1}:item))
  }

  const decrementCartItem = (productId)=>{
    setCart((prevCart)=>prevCart.map((item)=>item.id === productId?{...item,quantity:Math.max(item.quantity-1,0)}:item).filter(item=>item.quantity>0))
  }

  const subTotal = Object.values(cart).reduce((total,item)=>total+item.price*item.quantity,0)

  const progressPercentage = Math.min((subTotal/THRESHOLD)*100,100)

  const CartItemToDisplay = subTotal>=THRESHOLD?[...cart,{...FREE_GIFT,quantity:1}]:cart

  return (
   <div className="p-6 max-w-7xl mx-auto bg-gray-50  min-h-screen">
    <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Shopping Cart</h1>
    <div className="flex flex-col lg:flex-row gap-8">
      <div className='lg:w-2/3'>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
          {PRODUCTS.map(product =>(
            <div key={product.id} className="bg-white p-4 rounded-md shadow-md  flex flex-col  justify-between">
              <div className="mb-2">
                <h3 className="text-sm font-medium text-gray-700">{product.name}</h3>
                <span className="text-sm font-semibold text-gray-800">{product.price}</span>
              </div>
              <div className="flex items-center justify-between mt-4 gap-2">
                <button onClick={()=>handleDecrement(product.id)} className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300">-</button>
                <span className="text-sm font-semibold w-6 text-center">{quantities[product.id]||0}</span>
                <button onClick={()=>handleIncrement(product.id)} className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300">+</button>
              </div>
              <div className="flex justify-end mt-2">
                <button onClick={()=>addToCart(product)} className="bg-blue-600 text-white text-sm mt-4 w-full py-1 rounded hover:bg-blue-700">Add to Cart</button>
              </div>
            </div>

          ))}
        </div>
      </div>
    </div>

    <h2 className="text-xl font-semibold mt-6 text-gray-700">Cart Summary</h2>      
    <div className="mt-2 rounded bg-white p-4 shadow">
      <div className="border-b border-gray-950 pb-2">
        <p className="text-lg font-bold flex justify-between">
          <span>SubTotal:</span>
          <span>{subTotal}</span>
        </p>
      </div>
        <div className="mt-2 text-sm text-gray-600">
        {subTotal<THRESHOLD ?(
          <>
          <div className="bg-blue-50 p-6">
            <span>ADD RS {THRESHOLD - subTotal} more to get a{" "}
              <span className="font-medium text-blue-600">
                FREE Wireless Mouse!
              </span>
            </span>
            <div className="w-full bg-gray-200 border rounded-full mt-4 h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{width:`${progressPercentage}%`}}>
              </div>
            </div>
          </div>
            
          </>
        ):(
          <span className="font-medium text-green-600">You Unlocked The Free Wireless Mouse!</span>
        )}
      </div>
    </div>

     {CartItemToDisplay.length>0 && (
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">cart Items</h2>
        <div className="bg-white rounded shadow">
          {CartItemToDisplay.map((item)=>(
            <div key={item.id} className="p-4 border-b border-gray-200 last:border-b-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    RS {item.price} x {item.quantity} = RS {item.price * item.quantity}
                  </p>
                </div>
                {item.id === FREE_GIFT.id ?(
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">FREE GIFT</span>
                ):(
                  <div className="flex items-center gap-2">
                    <button onClick={()=>decrementCartItem(item.id)} className="bg-red-500 text-white h-6 w-6 rounded-full flex items-center justify-center hover:bg-red-600">
                      -
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button onClick={(()=>incrementCartItem(item.id))} className="bg-green-500 text-white h-6 w-6 rounded-full flex items-center justify-center hover:bg-green-600">
                      +
                      </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>  
     )}   
    
   </div>
  )
}

export default App
