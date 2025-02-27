<template>
  <div class="black-bg" v-if="modal">
    <div class="white-bg" @click.stop>
      <h4>상세 페이지</h4>
      <p>상세 페이지 내용</p>
      <button @click="modal = false" class="modal-close-button">
        모달 닫기
      </button>
    </div>
  </div>

  <div class="menu">
    <a v-for="(menu, index) in menus" v-bind:key="index">{{ menu }}</a>
  </div>

  <div>
    <div>
      <img src="./assets/room0.jpg" alt="" class="room-img" />
      <h4 :style="H4style" @click="modal = true">{{ products[0] }}</h4>
      <p>50 만원</p>
      <button @click="increase">허위매물신고</button>
      <span>신고수 : {{ reportsNumber }}</span>
    </div>

    <div v-for="(room, index) in oneRooms" v-bind:key="index">
      <img :src="room.image" alt="" class="room-img" />
      <h4 @click="modal = true">{{ room.title }}</h4>
      <p>{{ room.price }} 원</p>
    </div>
  </div>
</template>

<script>
import oneRoomData from "./assets/one_room";

export default {
  name: "App",
  data() {
    return {
      oneRooms: oneRoomData,
      H4style: "color : blue",
      products: ["역삼동 원룸", "천호동 원룸", "마포구 원룸"],
      menus: ["Home", "Products", "About"],
      reportsNumber: 0,
      modal: false,
    };
  },

  methods: {
    increase() {
      this.reportsNumber += 1;
    },
  },
  components: {},
};
</script>

<style>
body {
  margin: 0;
}

div {
  box-sizing: border-box;
}

.black-bg {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  padding: 20px;
  display: flex;
  justify-content: center;
}

.white-bg {
  width: 50%;
  height: 24%;
  border-radius: 8px;
  padding: 20px;
  background: white;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.menu {
  background: darkslateblue;
  padding: 15px;
  border-radius: 5px;
}
.menu a {
  color: white;
  padding: 10px;
}

.room-img {
  width: 100%;
  margin-top: 40px;
  border-radius: 5px;
}

.modal-close-button {
  width: 20%;
  height: 30%;
  margin-left: 80%;
}
</style>
