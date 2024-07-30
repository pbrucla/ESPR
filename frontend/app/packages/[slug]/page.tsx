import styles from "../../page.module.css";


export default function Page({ params }: { params: { slug: string } }) {
  const name = params.slug;

  return (
    <div className={styles.title}>
      <h1>{name}</h1>
    </div>
  );
}
