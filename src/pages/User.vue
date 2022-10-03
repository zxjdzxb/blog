<template>
  <div id="user">
    <section class="user-info">
      <img :src="user.avatar" :alt="user.username" class="avatar">
      <h3>{{ user.username }}</h3>
    </section>
    <section>
      <router-link class="item" v-for="blog in blogs" :key="blog.id" :to="`/detail/${blog.id}`">
        <div class="date">
          <span class="day">{{ splitDate(blog.createdAt).date }}</span>
          <span class="month">{{ splitDate(blog.createdAt).month }}月</span>
          <span class="year">{{ splitDate(blog.createdAt).year }}</span>
        </div>
        <h3>{{ blog.title }}</h3>
        <p>{{ blog.description }}</p>
      </router-link>
    </section>
    <section class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :current-page="page"
        @current-change="onPageChange">
      </el-pagination>
    </section>
  </div>
</template>

<script>
import blog from '@/api/blog'

export default {
  data() {
    return {
      blogs: [],
      user: {},
      page: 1,
      total: 0
    }
  },

  created() {
    this.userId = this.$route.params.userId
    this.page = this.$route.query.page || 1
    blog.getBlogsByUserId(this.userId, {page: this.page})
      .then(res => {
        console.log(res)
        this.page = res.page
        this.total = res.total
        this.blogs = res.data
        if (res.data.length > 0) {
          this.user = res.data[0].user
        }
      })
  },

  methods: {
    onPageChange(newPage) {
      blog.getBlogsByUserId(this.userId, {page: newPage}).then(res => {
        console.log(res)
        this.blogs = res.data
        this.total = res.total
        this.page = res.page
        this.$router.push({path: `/user/${this.userId}`, query: {page: newPage}})
      })
    },

    splitDate(dataStr) {
      let dateObj = typeof dataStr === 'object' ? dataStr : new Date(dataStr)
      return {
        date: dateObj.getDate(),
        month: dateObj.getMonth() + 1,
        year: dateObj.getFullYear()
      }
    }
  }
}
</script>

<style lang="less">
#login {
  color: red;
}
</style>
