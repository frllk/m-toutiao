<template>
  <div class=''>Layout</div>
</template>

<script>
import { userGetInfo } from '@/api/user.js'
export default {
  name: 'Layout',
  props: [],
  components: {},
  data () {
    return {}
  },
  methods: {

  },
  computed: {},
  async created () {
    await userGetInfo()
  },
  mounted () {}
}
</script>

<style scoped lang='less'></style>
