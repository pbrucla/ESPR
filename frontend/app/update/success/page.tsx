'use client'
import styles from '../../publish/page.module.css';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    return (
        <main>
            <div className={styles.title}>
                <h1>Package Operation Successful!</h1>
                <br/>
                <button className={styles.submitbutton} onClick={() => router.push('/')}>Back to Home Page!</button>
            </div>
        </main>
    )
}