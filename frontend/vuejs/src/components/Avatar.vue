<template>
  <div class="avatar">
    <span class="icon">
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
}
</style>
