const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ID = 1
const NAME = "Jewelry"
const CATEGORY = "Charm"
const IMAGE = "https://bafybeible72ij7v5jvmomvqd3bii2y3p6awtsb2efn6fiopw5ggz2ni6ge.ipfs.dweb.link/IMG-20230202-WA0034.jpg"
const COST = tokens(1)
const STOCK = 5

describe("PepeMatilda", () => {
  let pepematilda
  let deployer, buyer

  beforeEach(async () => {
    //setupaccounts
    [deployer, buyer] = await ethers.getSigners()
    console.log(deployer.address, buyer.address) 

    //deploy

    const PepeMatilda = await ethers.getContractFactory("PepeMatilda")
    pepematilda = await PepeMatilda.deploy()


  })

  describe("Deployment", () => {
    it("Sets the owner", async() => {
      expect(await pepematilda.owner()).to.equal(deployer.address)
    })
  })

  describe("Listing", () => {
    let transaction

   

    beforeEach(async () => {
      transaction = await pepematilda.connect(deployer).list(
        ID,
        NAME,
        CATEGORY,
        IMAGE,
        COST,
        STOCK
        
      )


      await transaction.wait()

    })
    
    it("Returns Item Attribute", async() => {
      const item = await pepematilda.items(ID)
      
      expect(item.id).to.equal(ID)
      expect(item.name).to.equal(NAME)
      expect(item.category).to.equal(CATEGORY)
      expect(item.image).to.equal(IMAGE)
      expect(item.cost).to.equal(COST)
      expect(item.stock).to.equal(STOCK)



    })
    
    it("Emit list event", () => {
      expect(transaction).to.emit(pepematilda, "List")
    })

  })
  describe("Buying", () => {
    let transaction

   

    beforeEach(async () => {
      transaction = await pepematilda.connect(deployer).list(ID,NAME,CATEGORY,IMAGE,COST,STOCK)
      await transaction.wait()


      //buy intem
      transaction = await pepematilda.connect(buyer).buy(ID, { value: COST })

    })
    

    it("Updates buyer's order count", async () => {
      const result = await pepematilda.orderCount(buyer.address)
      expect(result).to.equal(1)
    })

    it("Adds the order", async () => {
      const order = await pepematilda.orders(buyer.address, 1)

      expect(order.time).to.be.greaterThan(0)
      expect(order.item.name).to.equal(NAME)
    })

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(pepematilda.address)
      expect(result).to.equal(COST)
    })

    it("Emits Buy event", () => {
      expect(transaction).to.emit(pepematilda, "Buy")
    })

  })


  describe("Withdrawing", () => {
    let balanceBefore

  
    beforeEach(async () => {
      transaction = await pepematilda.connect(deployer).list(ID,NAME,CATEGORY,IMAGE,COST,STOCK)
      await transaction.wait()


      //buy a item
      transaction = await pepematilda.connect(buyer).buy(ID, { value: COST })

      balanceBefore = await ethers.provider.getBalance(deployer.address)

      transaction = await pepematilda.connect(deployer).withdraw()
      await transaction.wait()


    })



    it("Updates the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)

    expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it("Adds the order", async () => {
      const order = await pepematilda.orders(buyer.address, 1)

      expect(order.time).to.be.greaterThan(0)
      expect(order.item.name).to.equal(NAME)
    })

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(pepematilda.address)
      expect(result).to.equal(0)
    })

  

  })

  

})
