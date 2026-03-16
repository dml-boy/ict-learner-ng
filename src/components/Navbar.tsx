import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.search}>
        <input type="text" placeholder="Search modules, topics..." className={styles.searchInput} />
      </div>
      
      <div className={styles.actions}>
        <div className={styles.user}>
          <div className={styles.avatar}>A</div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>Admin Teacher</p>
            <p className={styles.userRole}>Lagos State District</p>
          </div>
        </div>
      </div>
    </header>
  );
}
