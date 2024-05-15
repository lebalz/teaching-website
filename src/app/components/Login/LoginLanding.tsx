import styles from "./styles.module.scss";
import {LoginStrategy} from "@site/src/app/components/Login/model";
import clsx from "clsx";

export interface Props {
  loginStrategies: LoginStrategy[];
  onLoginViaEmail: () => void;
}

const LoginLanding = ({loginStrategies, onLoginViaEmail}: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.loginStrategyButtons}>
        {loginStrategies.includes(LoginStrategy.GBSL_KONTO)
          && <button className={clsx('button', 'button--primary')}>Login mit GBSL-Konto</button>}
        {loginStrategies.includes(LoginStrategy.EMAIL)
          && <button className={clsx('button', 'button--primary')} onClick={onLoginViaEmail}>Login via E-Mail</button>}
      </div>
    </div>
  )
};

export default LoginLanding;
