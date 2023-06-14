<template>
  <Transition name="tab">
    <button v-if="scrolled" class="top rounded-circle position-fixed m-3 end-0 bottom-0 btn btn-primary shadow" role="button" @click="topFunction()"><Icon name="solar:arrow-up-linear" size="1.5rem" /></button>
  </Transition>
</template>

<script>
export default {
  data () {
    return {
      scrolled: false,
      maxScroll: 600
    };
  },
  mounted () {
    window.onscroll = () => {
      this.scrolled = (document.body.scrollTop > this.maxScroll || document.documentElement.scrollTop > this.maxScroll);
    };
  },
  methods: {
    topFunction () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
};
</script>

<style>
.top {
  width: 3rem;
  height: 3rem;
}
</style>
