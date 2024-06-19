export const callGet = async (url, params) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("user")}`,
    },
    body: JSON.stringify(params),
  });
  return response.json();
};
