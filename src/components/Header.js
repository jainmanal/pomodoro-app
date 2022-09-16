import { Link } from "react-router-dom";
import Logo from "./Logo";
import Icon from "./Icon";
import classes from "./Header.module.css";

function Button({ icon, children, onClick }) {
  return (
    <button className={classes.button} onClick={onClick}>
      <Icon name={icon} />
      <span className={classes.label}>{children}</span>
    </button>
  );
}

export default function Header() {

  return (
    <header className={classes.container}>
      <div className={classes.content}>
        <Logo />
        <ul className={classes.nav}>
          <li>
            <Link to="/settings">
              <Button icon="settings">Setting</Button>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
