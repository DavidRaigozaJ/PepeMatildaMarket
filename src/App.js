import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import PepeMatilda from './abis/PepeMatilda.json'
// Config
import config from './config.json'

const App = () => {
const [provider, setProvider] = useState(null)
const [pepematilda, setPepeMatilda] = useState(null)

const [account, setAccount] = useState(null)

const [anillos, setAnillos] = useState(null)
const [collares, setCollares] = useState(null)
const [aretes, setAretes] = useState(null)

const [item, setItem] = useState({})
const [toggle, setToggle] = useState(false)

const togglePop = (item) => {
setItem(item)
toggle ? setToggle(false) : setToggle(true)
}

const loadBlockchainData = async () => {
let provider;
if (window.ethereum) {
provider = new ethers.providers.Web3Provider(window.ethereum)
} else {
provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
}
setProvider(provider)
const network = await provider.getNetwork()

const pepematilda = new ethers.Contract(config[network.chainId].pepematilda.address, PepeMatilda, provider)
setPepeMatilda(pepematilda)

console.log(pepematilda)

if (!pepematilda) {
  return;
}

// load products
const items = []

for (var i = 0; i < 9; i++) {
  const item = await pepematilda.items(i + 1)
  items.push(item)
}

const anillos = items.filter((item) => item.category === 'anillos')
const collares = items.filter((item) => item.category === 'collares')
const aretes = items.filter((item) => item.category === 'aretes')

setAnillos(anillos)
setCollares(collares)
setAretes(aretes)
}

useEffect(() => {
  loadBlockchainData();
}, []);


  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <h2>PepeMatilda</h2>
      <div>
        
      </div>
      {anillos && collares && aretes && ( 
            <>
            <Section title={"Anillos"} items={anillos} togglePop={togglePop} />
            <Section title={"Collares"} items={collares} togglePop={togglePop} />
            <Section title={"Aretes"} items={aretes} togglePop={togglePop} />
            </>
      )}
      <div/>
        {toggle && (
          <Product item={item} provider={provider} account={account} pepematilda={pepematilda} togglePop={togglePop} />
        )}
    </div>
  );
}

export default App;
