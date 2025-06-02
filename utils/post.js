const axios = require('axios');

exports.postToBlogger = async function(blogId, accessToken, title, htmlContent) {
  try {
    await axios.post(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/`, {
      kind: "blogger#post",
      title,
      content: htmlContent
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });

    console.log(`✅ Posted: ${title}`);
  } catch (err) {
    console.error("❌ Post failed:", err.response?.data || err.message);
  }
};
