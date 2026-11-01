/* 可以放在网页里的公开配置。不要写入 service_role 或 sb_secret。
   phoneOtp 保持 false：演示登录只用验证码 123456，不会发短信。
   以后在 Supabase 打开 Phone 登录后，再把 phoneOtp 改成 true。 */
window.EPITAPH_SUPABASE = {
  url: "https://mhivbzcncrlzzjzqldrq.supabase.co",
  key: "sb_publishable_L_MvtQslyM4ZtGoRZDf6qQ_HGBLRCK1",
  phoneOtp: false
};
