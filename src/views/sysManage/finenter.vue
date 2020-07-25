<template>
  <el-row class="finenterClass">
    <el-col :span="10" :offset="1" >
      <div class="Card">
          <span class="TitleName">总交收款</span>
          <div class="ContentClass">
            <img class="imgClass" src="../../assets/Coins-2.png" alt="">
            <span class="moneyClasss">{{TotalCollection}} 元</span>
          </div>
      </div>
    </el-col>
    <el-col :span="10" :offset="1">
      <div class="Card">
          <p class="TitleName">总交易笔数</p>
          <div class="ContentClass">
            <img class="imgClass" src="../../assets/tab_ss.png" alt="">
            <span class="moneyClasss">{{totalOrder}} 笔</span>
          </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      TotalCollection:"",
      totalOrder:""
    }
  },
  mounted(){
    this.getTotalCollection()
    this.getTtotalOrder()
  },
  methods: {
    getTotalCollection(){
      var that = this
      that.Httpclient({
          url:'/api/finance/totalCollection',
          data:{},
          method: "get"
      }).then(res => {
          if(res.code==0){
            that.TotalCollection = res.data
          }
      })
    },
    getTtotalOrder(){
      var that = this
      that.Httpclient({
          url:'/api/finance/totalOrder',
          data:{},
          method: "get"
      }).then(res => {
          if(res.code==0){
            that.totalOrder = res.data
          }
      })
    }
  }
};
</script>

<style>
  .finenterClass{
    /* margin: 30px 10px 10px 10px; */
    background-color: #eff1f4;
    min-height: 768px;
   
  }
  .Card{
    height: 300px;
    margin-top: 20px;
    padding: 10px 20px 20px 20px;
    background-color:white;
    box-shadow: 5px white, 5px white; 
    /* border: 1px solid #000; */
  }
  .TitleName{
    display: inline-block;
    margin-bottom: 20px;
    font-size: 24px;
  }
  .imgClass{
    vertical-align:top;
    margin-right: 20px;
  }
  .moneyClasss{
    float: right;
    font-size: 36px;
  }
</style>