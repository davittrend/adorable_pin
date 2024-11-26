import fetch from "node-fetch";

export const handler = async (event, context) => {
  const pinterestUrl = "https://api.pinterest.com/v5/user_account";
  const response = await fetch(pinterestUrl, {
    method: "GET",
    headers: {
      "Authorization": "Bearer YOUR_ACCESS_TOKEN"
    }
  });

  if (!response.ok) {
    return {
      statusCode: response.status,
      body: JSON.stringify({ error: "Failed to fetch profile" })
    };
  }

  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
