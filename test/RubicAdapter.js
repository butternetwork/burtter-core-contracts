
let { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
let { BigNumber } = require("ethers");
const { expect } = require("chai");
const { ethers, network } = require("hardhat");
let {updateSelectorInfo,setRouters,setStargatePoolId,setLayerZeroChainId} = require("../utils/helper")

let RubicMultiProxy = "6AA981bFF95eDfea36Bdae98C26B274FfcafE8d3"
let wToken = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

let ERC20 = [
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function balanceOf(address account) external view returns (uint256)',
    'function transfer(address to, uint value) external returns (bool)'
]

let ERC1155 = [
    'function balanceOf(address account, uint256 id) external view returns (uint256)'
]
//// fork mainnet
describe("RubicAdapter", function () {
    let adapter;
    async function deployFixture() {
        let [wallet] = await ethers.getSigners();
        let RubicAdapter = await ethers.getContractFactory("RubicAdapter");
        adapter = await RubicAdapter.deploy(wallet.address);
        await adapter.deployed();
        await updateSelectorInfo(adapter.address,"Eth");
        await setRouters(adapter.address,"Eth");
        await setStargatePoolId(adapter.address,"Eth");
        await setLayerZeroChainId(adapter.address,"Eth");
    }

   
    //tx https://etherscan.io/tx/0xf2e0077bfed1e4f9da01d5fdb440c0537d42dbf8d471483b5e7716ed584c493f
    it("startViaRubic -> bridge via xy", async () => {
        let user; 
        let waves
        this.timeout(0)
        await network.provider.request({
            method: 'hardhat_reset',
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://eth-mainnet.alchemyapi.io/v2/" + process.env.ALCHEMY_KEY,
                        blockNumber: 17660944,
                    },
                },
            ],
        })
        await network.provider.request({
            method: 'hardhat_impersonateAccount',
            params: ['0xd71942d7Df714E3eDE74762DbDf63B7b5Bd2729D'],
        })
        await network.provider.request({
            method: 'hardhat_impersonateAccount',
            params: ['0xA7EFAe728D2936e78BDA97dc267687568dD593f3'],
        })
        user = await ethers.getSigner('0xd71942d7Df714E3eDE74762DbDf63B7b5Bd2729D')
        waves = await ethers.getSigner('0xA7EFAe728D2936e78BDA97dc267687568dD593f3')
        tx = {
            to: user.address,
            value: ethers.utils.parseEther('2', 'ether')
        };
        await waves.sendTransaction(tx);
        let amount = ethers.utils.parseEther("1.451320277668136368");
        let data = "0xe1fcde8e0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000244d0eaff7600000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000134d7cd659df400000000000000000000000000000000000000000000000000000000000000001903c9fd8af99ca955d2737a5624753bf66c1a69285fee5244606c1e608624ed5ee00000000000000000000000000000000000000000000000000000000000001800000000000000000000000003fff9bdeb3147ce13a7ffef85dae81874e0aedbe0000000000000000000000002970d4706b639dcac1716f443187508b98e916f400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d71942d7df714e3ede74762dbdf63b7b5bd2729d000000000000000000000000d71942d7df714e3ede74762dbdf63b7b5bd2729d00000000000000000000000000000000000000000000000014201292660db80000000000000000000000000000000000000000000000000000000000000001440000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000096e61746976653a7879000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
        await deployFixture();
        // let token = await ethers.getContractAt(ERC20, _srcToken, user); 
        // await(await token.approve(adapter.address,amount)).wait();  
        await expect(adapter.connect(user).startViaRubic([],[],data,{value:amount})).to.emit(adapter,"TransferStarted")

    })

        // tx https://etherscan.io/tx/0xa7fb5dc47d0ea29cd2273ff4945157d5348b83dd6ba5bc378da0874cbc2ee36f
        it("startViaRubic -> GenericSwap", async () => {
            let user; 
            let waves
            this.timeout(0)
            await network.provider.request({
                method: 'hardhat_reset',
                params: [
                    {
                        forking: {
                            jsonRpcUrl: "https://eth-mainnet.alchemyapi.io/v2/" + process.env.ALCHEMY_KEY,
                            blockNumber: 17668244,
                        },
                    },
                ],
            })
            await network.provider.request({
                method: 'hardhat_impersonateAccount',
                params: ['0xfFe0Bf6DC61D40Af3519e5F1090c3C0AfDE41844'],
            })
            await network.provider.request({
                method: 'hardhat_impersonateAccount',
                params: ['0xA7EFAe728D2936e78BDA97dc267687568dD593f3'],
            })
            user = await ethers.getSigner('0xfFe0Bf6DC61D40Af3519e5F1090c3C0AfDE41844')
            waves = await ethers.getSigner('0xA7EFAe728D2936e78BDA97dc267687568dD593f3')
            tx = {
                to: user.address,
                value: ethers.utils.parseEther('2', 'ether')
            };
            await waves.sendTransaction(tx);
            let amount = ethers.utils.parseEther("2000");
            let data = "0xe1fcde8e000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000010000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000006c6b935b8bbd4000000000000000000000000000000000000000000000000000000000000000000304b3474174c5bb3f657acc33a74d10c19fa65a6d489780928157363e06d7dd5332dd417129000000000000000000000000a96598475cb54c281e898d2d66fcfbe9c87695070000000000000000000000000cd243dccfc62e39026c269059a0200d924e4bef000000000000000000000000ffe0bf6dc61d40af3519e5f1090c3c0afde418440000000000000000000000000000000000000000000000000000156361beadb200000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000006352a56caadc4f1e25cd6c75970fa768a3304e640000000000000000000000006352a56caadc4f1e25cd6c75970fa768a3304e640000000000000000000000006b175474e89094c44da98b954eedeac495271d0f0000000000000000000000002b591e99afe9f32eaa6214f7b7629768c40eeb3900000000000000000000000000000000000000000000006c6b935b8bbd40000000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000e4bc80f1a80000000000000000000000006aa981bff95edfea36bdae98c26b274ffcafe8d300000000000000000000000000000000000000000000006c4fd1ee246e780000000000000000000000000000000000000000000000000000000015627fd14dce000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000020000640000000000000000006c6bc977e13df9b0de53b251522280bb7238370080000000000000000000000069d91b94f0aaf8e8a2586909fa77a5c2c89818d50000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

            await deployFixture();
            data = data.replace(RubicMultiProxy.toLowerCase(),adapter.address.substring(2));
            let token = await ethers.getContractAt(ERC20, "0x6B175474E89094C44Da98b954EedeAC495271d0F", user); 
            await(await token.approve(adapter.address,amount)).wait();  
            await expect(adapter.connect(user).startViaRubic([],[],data)).to.emit(adapter,"SwappedGeneric")
    
        })


    //tx https://etherscan.io/tx/0x971e26c20a91032dd8a4f1c26acbf20387c4078a41d10471d71a1908afa32a33
    it("startViaRubic -> GenericSwap", async () => {
        let user; 
        let waves
        this.timeout(0)
        await network.provider.request({
            method: 'hardhat_reset',
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://eth-mainnet.alchemyapi.io/v2/" + process.env.ALCHEMY_KEY,
                        blockNumber: 17667679,
                    },
                },
            ],
        })
        await network.provider.request({
            method: 'hardhat_impersonateAccount',
            params: ['0xdEe331526Bf2e2F9a3B55B01179354d727658fca'],
        })
        await network.provider.request({
            method: 'hardhat_impersonateAccount',
            params: ['0xA7EFAe728D2936e78BDA97dc267687568dD593f3'],
        })
        user = await ethers.getSigner('0xdEe331526Bf2e2F9a3B55B01179354d727658fca')
        waves = await ethers.getSigner('0xA7EFAe728D2936e78BDA97dc267687568dD593f3')
        tx = {
            to: user.address,
            value: ethers.utils.parseEther('2', 'ether')
        };
        await waves.sendTransaction(tx);
        let amount = "21978000000000000";
        let data = "0xe1fcde8e0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002e4b3474174af5af7663c102e4fbff296613b4116d893a5660df81e6db2d7dc0d151665bdb4000000000000000000000000a96598475cb54c281e898d2d66fcfbe9c876950700000000000000000000000070c15475cd4e2b2ea27d1a2ecbb78a735e8fb44f000000000000000000000000dee331526bf2e2f9a3b55b01179354d727658fca000000000000000000000000000000000000000000000000000000729a85f21f00000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000001111111254eeb25477b68fb85ed929f73a9605820000000000000000000000001111111254eeb25477b68fb85ed929f73a96058200000000000000000000000000000000000000000000000000000000000000000000000000000000000000002b591e99afe9f32eaa6214f7b7629768c40eeb39000000000000000000000000000000000000000000000000004e28e2290f000000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c80502b1c50000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e14dfe2dfa000000000000000000000000000000000000000000000000000000000729a85f21f0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000180000000000000003b6d034055d5c232d921b9eaa6b37b5845e439acd04b4dbacfee7c0800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
        await deployFixture();
        data = data.replace(RubicMultiProxy.toLowerCase(),adapter.address.substring(2));
        await expect(adapter.connect(user).startViaRubic([],[],data,{value:amount})).to.emit(adapter,"SwappedGeneric")

    })

})