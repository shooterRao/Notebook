<template>
  <div class="to-top" ref="toTop" @click="scrollToTop">
    <svg
      t="1547626010869"
      class="icon"
      style
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2064"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="64"
      height="64"
    >
      <path
        d="M511.5 102.5c-225.3 0-409.6 184.3-409.6 409.6s184.3 409.6 409.6 409.6 409.6-184.3 409.6-409.6-184.3-409.6-409.6-409.6z m-56.3 716.8h-30.7v-30.7h30.7v30.7z m0-51.2h-30.7v-30.7h30.7v30.7z m76.8 87.1h-46.1v-41h41v41h5.1z m0-61.5h-46.1v-41h41v41h5.1z m56.3 25.6h-30.7v-30.7h30.7v30.7z m0-51.2h-30.7v-30.7h30.7v30.7z m0-302.1v240.6H424.4V466H306.7l204.8-245.8L716.3 466h-128z m0 0"
        fill="#3eaf7c"
        p-id="2065"
      ></path>
    </svg>
  </div>
</template>

<script>
import { throttle } from "./utils.js";
const DISTANCE = 300;
export default {
  name: "ToTop",
  data() {
    return {
      onscroll: null
    };
  },
  mounted() {
    this.onscroll = throttle(() => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrollTop >= DISTANCE) {
        this.$refs.toTop.classList.add("show");
      } else {
        this.$refs.toTop.classList.remove("show");
      }
    }, 200);
    window.addEventListener("scroll", this.onscroll);
  },
  methods: {
    scrollToTop() {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrollTop > 0) {
        window.requestAnimationFrame(this.scrollToTop);
        window.scrollTo(0, scrollTop - scrollTop / 8);
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onscroll);
    this.onscroll = null;
  }
};
</script>

<style>
.to-top {
  position: fixed;
  bottom: 100px;
  right: -64px;
  height: 64px;
  width: 64px;
  cursor: pointer;
  transition: all 0.3s;
  will-change: auto;
}
.to-top.show {
  right: 50px;
  will-change: transform;
}
</style>