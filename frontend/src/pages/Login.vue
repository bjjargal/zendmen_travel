<template>
  <div class="flex flex-col md:flex-row min-h-screen">
    <div class="w-full flex items-center justify-center p-8 min-h-screen backround-image">
      <div
        class="w-full max-w-md bg-white/95  backdrop-blur-sm rounded-xl shadow-2xl p-8 transition-all duration-300 hover:shadow-2xl relative">
        <div class="">
          <div class="flex justify-center mb-8">
            <img class="h-40" src="@/assets/images/zlogo.png" :alt="'LOGO'" />
          </div>
        </div>
        <a-form :model="form" name="basic" @submit="submit">
          <a-form-item name="email" :rules="[{ required: true, message: 'Е-Майл хаягаа оруулна уу!' }]">
            <label for="email">Е-Майл хаяг</label>
            <a-input size="large" v-model:value="form.email" class="rounded p-2 " />
          </a-form-item>

          <a-form-item name="password" :rules="[{ required: true, message: 'Нууц үгээ оруулна уу!' }]">
            <label for="password">Нууц үг</label>
            <a-input-password size="large" v-model:value="form.password" class="rounded p-2" />
          </a-form-item>

          <div class="flex justify-between mb-4">
            <a-form-item name="remember">
              <a-checkbox shape="circle" v-model:checked="form.remember">
                Сануулах
              </a-checkbox>
            </a-form-item>
            <a-button type="ghost">Нууц үг мартсан</a-button>
          </div>

          <a-form-item>
            <a-button type="primary" size="large" html-type="submit" class="w-full font-bold bg-[#111727] ">
              Нэвтрэх
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { sessionStore } from '@/data/session'
import { reactive } from 'vue'
import { message } from 'ant-design-vue';

const session = sessionStore()

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const rememberedEmail = localStorage.getItem('rememberEmail')
if (rememberedEmail) {
  form.email = rememberedEmail
  form.password = localStorage.getItem('rememberPassword') || ''
  form.remember = true
}

const submit = async () => {
  try {
    await session.login.submit({
      email: form.email,
      password: form.password,
    })

    if (form.remember) {
      localStorage.setItem('rememberEmail', form.email)
      localStorage.setItem('rememberPassword', form.password)
    } else {
      localStorage.removeItem('rememberEmail')
      localStorage.removeItem('rememberPassword')
    }

  } catch (e) {
    message.error({
      content: 'Е-майл эсвэл нууц үг буруу байна',
      duration: 1
    });
  }
}
</script>

<style scoped>
.backround-image {
  background-image: url("@/assets/images/backround.png");
  background-size: cover;
  background-position: center;
}
</style>
