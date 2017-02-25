<template>
  <div class="avatar">
    <span class="icon" v-bind:style="styles">
      {{ initials }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'avatar',
  props: ['userName'],
  computed: {
    initials: function() {
      if (!this.userName) {
        return '';
      }

      return this.userName.split(' ')
                .map(a => a.charAt(0).toUpperCase())
                .join('');
    },
    styles: function() {
      if (!this.userName) {
        return {}
      }
      const c = i => this.userName.charCodeAt(i)

      return {
        fontSize: 15,
        color: `rgb(${c(0)*2}, ${c(1)*2 - c(0)}, ${c(2)*2 + c(0)})`,
        background: `rgb(${c(0) * 15 % 255}, ${c(1) * 5 % 255}, ${c(2) * c(0) % 255})`,
      }
    }
  }
}
</script>

<style scoped>
.avatar {
  display: inline-block;
  margin: 8px;
}
.avatar .icon {
  width: 34px;
  height: 34px;
  padding: auto;
  font-weight: bold;
  background: #CE4F3F;
  color: #000;
  padding: 8px 12px;
  border-radius: 18px;
}
</style>
