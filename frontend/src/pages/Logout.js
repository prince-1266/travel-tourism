export default function Logout() {
  localStorage.clear();
  window.location = "/login";
  return null;
}
