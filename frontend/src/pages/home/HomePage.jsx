import { useAuthStore } from "../../store/authStore.js";
import AuthScreen from "./AuthScreen.jsx";
import HomeScreen from "./HomeScreen.jsx";

const HomePage = () => {
  const { user } = useAuthStore();  // ✅ Ensure correct state extraction

  return (
    <div>
      {user ? <HomeScreen /> : <AuthScreen />}
    </div>
  );
};

export default HomePage;
