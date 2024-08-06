'use client'

import styles from "./page.module.css";
import React from 'react';

import FilterBtn from "../../public/icons/filter.svg";
import ClearBtn from "../../public/icons/clear.svg";

const back_url = "http://127.0.0.1:5000";

const include = new Set<string>([]);
const exclude = new Set<string>([]);
let userInput = "";

type Package = {
    name: string;
    description: string;
    version_history: string[];
    package_address: string;
}

type DisplayType = {
    data: Package;
    display: boolean;
};

export default function Browse(){
    const [pack, setPack] = React.useState<Package[]>([]);


    /* expand toggles: sidebar, menus */
    const [open, setOpen] = React.useState(false);
    const toggle = () => {
        setOpen(!open);
    };

    /* search bar */
    const [keyphrase, setKeyphrase] = React.useState<string>(userInput);
    function handleInput(keyphrase: string) {
        userInput = keyphrase.toLowerCase();
        setKeyphrase(userInput);
        ApplyFilter();
    }
    function ClearInput() {
        userInput = "";
        setKeyphrase("");
        ApplyFilter();
    }

    /* filter system */
    const [show, setShow] = React.useState<DisplayType[]>([]);
    const [noShow, setNoShow] = React.useState<boolean>(false);

    function ApplyFilter() {
        show.forEach((pack) => {
            const name = pack.data.name;
            if (userInput.length !== 0) {
                if (name.toLowerCase().includes(userInput)) {
                    pack.display = true;
                } else {
                    pack.display = false;
                }
            } else {
                pack.display = true;
            }
        });
        setShow([...show]);
    }

    
    React.useEffect(() => {
        const getPacks = async () => {
            try {
                const response = await fetch(`${back_url}/packages`);
                if (!response.ok){
                    throw new Error(`Response status: ${response.status}`);
                }
                const json: Package[] = await response.json();
                setPack(json);
                setShow(
                    json.map((chall: Package) => {
                        return {data: chall, display: true};
                }));
                setLoadingMsg(null);
            } catch (error){
                if (error instanceof Error){
                    setLoadingMsg("An unexpected error occurred");
                    console.error(error.message);
                }
            }
        };
        getPacks();
    },[]);

    React.useEffect( () => {
        if (show.every(item => item.display === false))
            setNoShow(true);
        else
            setNoShow(false);
    }, [show])

    const [loadingMsg, setLoadingMsg] = React.useState<string | null>("Loading Challenges...");


    const toRender = (
        show.map(({data, display}) => 
            <div key={data.name}>
                {
                display ? (
                    <div className={styles.packitem}>
                    <span>
                        <h2 className={styles.h2inline}>
                            <a href={"/packages/" + data.package_address} className={styles.a}>{data.name}</a>
                        </h2>
                        <p className={styles.pinline}>{data.version_history[data.version_history.length-1]}</p>
                    </span>
                    <p>{data.description}</p>
                    </div>
                )
                : null
                }
            </div>
        )
    );

    return (
        <main>
            <div>
                <div className={styles.title}>
                    <h1>Browse For Packages</h1>
                </div>
                <div style={{width: "100%", height: "100vw", display: "flex"}}>

                    <div className={open ? styles.sideOpen : styles.sideClose}>
                        <button onClick={toggle} className={open ? styles.hide : `${styles.filterbtn} ${styles.close}`}>
                            <FilterBtn />
                        </button>

                        {open && (
                            <div>
                                <div className={styles.block}>
                                    <button onClick={toggle} className={`${styles.filterbtn} ${styles.open}`}>
                                        <FilterBtn />
                                    </button>
                                </div>

                                <div className={styles.search}>
                                    <input
                                        className={styles.searchbar}
                                        type="text"
                                        placeholder="Search name..."
                                        value={keyphrase}
                                        onChange={(e) => handleInput(e.target.value)}
                                    ></input>
                                    <button className={styles.searchbtn} onClick={() => ClearInput()}>
                                        <ClearBtn />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {/*FILTERBAR: end*/}

                    {loadingMsg && <div className={styles.errorMsg}>{loadingMsg}</div>}


                    {(loadingMsg === null && noShow) ?
                        <div className={styles.errorMsg}>
                            No Packages Found
                        </div> 
                    : toRender}
                </div>
            </div>
        </main>
    );
}