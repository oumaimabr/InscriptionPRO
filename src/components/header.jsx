import Btn from "./btn"
import Logo from '../assets/images/logo.svg'
const Header=()=>{
    return(
        <header>
            <div className="container d-flex justify-content-between align-items-center">
                <img src={Logo} alt="logo" />
                <Btn classbtn={"primary-btn"} name={'Commencer gratuitement'} />
            </div>
        </header>
    )
}
export default Header