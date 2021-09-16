const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const BigNumber = web3.BigNumber;
//require('chai').use(require('chai-bignumber')(BigNumber)).should();
require('chai').use(require('chai-as-promised')).should();
const QToken = artifacts.require('QToken');
contract('QToken', function(accounts) {
        const _name = "QToken";
        const _symbol = "QT";
        const _totalSupply = 100000000;
    beforeEach(async function(){
            this.token = await QToken.new(_name,_symbol,_totalSupply);
         });
    describe('check attributes',function(){
        it('check name',async function(){
            const name = await this.token.getName();
            name.should.equal(_name);
        });
        it('check symbol',async function(){
            const symbol = await this.token.getSymbol();
            symbol.should.equal(_symbol);
        });
        it('check totalSupply',async function(){
            const totalSupply = await this.token.getTotalSupply();
            assert.equal(totalSupply,_totalSupply,"should be equal to total supply");
        });
    });
    it("should return the balance of token owner", function() {
          return this.token.balanceOf.call(accounts[0]).then(function(result){
          assert.equal(result.toNumber(), 0, 'balance is wrong');
        })
      });
      describe('test mint and burn',function(){
            it('testing mint', async function(){
                    await  this.token.mint(accounts[0],10000);
                    return this.token.balanceOf.call(accounts[0]).then(function(result){
                        assert.equal(result.toNumber(),10000,'balance is not correct');
                     })
                })
           it('testing burn', async function(){
            await  this.token.mint(accounts[0],10000);
            await  this.token.burn(accounts[0],5000);
                return this.token.balanceOf.call(accounts[0]).then(function(result){
                    assert.equal(result.toNumber(),5000,'balance is not correct');
                })
            })
       });
       describe('test approve and Allowance',function(){
           it('testing approve',async function(){
               await this.token.mint(accounts[0],10000);
               await this.token.approve(accounts[0],accounts[1],5000)
               return this.token.allowance.call(accounts[0],accounts[1]).then(function(result){
                   assert.equal(result.toNumber(),5000,"should have allowance 5000");
               })
           });
       });
       describe('test transfer and transferFrom',function(){
                it('testing transfer',async function(){
                    await  this.token.mint(accounts[0],10000);
                    await this.token.transfer(accounts[1],1000);
                    return this.token.balanceOf.call(accounts[1]).then(function(result){
                        assert.equal(result.toNumber(),1000,"Should transfer 1000");
                    })
                })
                it('testing transferFrom',async function(){
                    await this.token.mint(accounts[0],10000);
                    await this.token.approve(accounts[0],accounts[1],5000);
                    await this.token.transferFrom(accounts[0],accounts[2],3000,{from: accounts[1]});
                    const balance = await this.token.balanceOf.call(accounts[2]);
                        assert.equal(balance,3000,'should transfer 3000');
                    })
                });
       describe("Negative Testing",function(){
           it("test minted with other then contract's owner",async function(){
            await this.token.mint(accounts[1],10000,{from:accounts[1]}).should.be.rejectedWith("This function is restricted to the contract's owner");
           });
           it('test transfer exceeds amount',async function(){
            await this.token.mint(accounts[0],1000);
            await this.token.transfer(accounts[1],1100).should.be.rejectedWith("transfer amount exceeds balance");
           });
           it('test transfer amount does exceed allowance',async function(){
            await this.token.mint(accounts[0],10000);
            await this.token.approve(accounts[0],accounts[1],5000);
            await this.token.transferFrom(accounts[0],accounts[2],6000,{from:accounts[1]}).should.be.rejectedWith("transfer amount exceeds allowance");
           
           });
           it('test burn amount exceeds allowance',async function(){
               await this.token.mint(accounts[0],10000);
               await this.token.burn(accounts[0],11000).should.be.rejectedWith("burn amount exceeds balance");
           })
       });
    });



 