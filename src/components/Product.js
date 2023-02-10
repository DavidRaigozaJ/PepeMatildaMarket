//import { useEffect } from 'react';
import { ethers } from 'ethers';

// Components

import close from '../assets/close.svg'

const Product = ({ item, provider, account, pepematilda, togglePop }) => {
  const buyHandler = async () => {
    const signer = await provider.getSigner()

    let transaction = pepematilda.connect(signer).buy(item.id, { value: item.cost})
    await transaction.wait()

  }

  return (
    <div className="product">
      <div className="product__details">
        <div className="product__image">
          <img src={item.image} alt="Product" />
        </div>
        <div className="product__overview">
          <h1>{item.name}</h1>

          <hr />

          <p>{item.address}</p>
          <h2>{ethers.utils.formatUnits(item.cost.toString(), 'ether')} ETH</h2>

          <hr />

          <h2>Descripcion</h2>

          <p>
            {item.description}

          </p>
          </div>

            <div className="product__order">
                <h1>{ethers.utils.formatUnits(item.cost.toString(), 'ether')} ETH</h1>

                <button className='product__buy' onClick={buyHandler}>
                  Compra
                </button>

                <button onClick={togglePop} className="product__close">
                  <img src={close} alt="Close" />

                </button>
        </div>
      </div>
    </div >
  );
}

export default Product;