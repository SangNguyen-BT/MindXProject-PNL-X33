import About from "../components/homepage/About";
import Contact from "../components/homepage/Contact";
import MovieSearch from "../components/homepage/MovieSearch";
import AccountInfo from "../components/AccountInfo";
import Tickets from "../components/Tickets";
import TermConditions from "../components/TermConditions";
import Privacy from "../components/Privacy";

import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import MovieDetail from "../pages/MovieDetail";
import ResetPassword from "../pages/ResetPassword";
import MyProfile from "../pages/MyProfile"
import BuyTickets from "../pages/BuyTickets";
import SelectSeat from "../pages/SelectSeat";
import Payment from "../pages/Payment"

const setupRouter = [
  { url: "/", component: HomePage },
  { url: "/search/:keyword", component: MovieSearch },
  { url: "/About", component: About },
  { url: "/Contact", component: Contact },
  { url: "/:city/movies/:movieid", component: MovieDetail},
  { url: "/Login", component: Login},
  { url: "/reset-password/:token", component: ResetPassword},
  { url: "/profile", component: MyProfile},
  { url: "/:city/movies/:movieid/buytickets", component: BuyTickets},
  { url: "/:city/movies/:movieid/buytickets/:screenid", component: SelectSeat},
  { url: "/payment", component: Payment},
  { url: "/accountInfo", component: AccountInfo},
  { url : "/tickets", component : Tickets},
  { url : "/termsCondition", component : TermConditions},
  { url : "/privacy", component : Privacy},

];
export { setupRouter };
