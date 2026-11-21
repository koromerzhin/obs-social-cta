/*
 * =========================================================
 * OBS SOCIAL CTA
 * =========================================================
 *
 * Séquence :
 *
 * 👍 Like
 * 💬 Commenter
 * ↗ Partager
 * ❤️ S'abonner
 *
 * L'overlay est transparent et fonctionne directement
 * comme "Source navigateur" dans OBS.
 *
 * Variante (stream / record) via window.CTA_VARIANT
 * défini dans le HTML avant ce script.
 *
 * =========================================================
 */

const cta = document.querySelector("#cta");

const icon = document.querySelector("#icon");
const eyebrow = document.querySelector("#eyebrow");
const message = document.querySelector("#message");

const CONFIG = {

    /*
     * Temps d'affichage de chaque message.
     */
    displayTime: 3400,

    /*
     * Temps entre deux messages.
     */
    delayBetween: 450,

    /*
     * Temps entre deux boucles complètes.
     */
    delayBetweenLoops: 3000,

    /*
     * Nombre de répétitions.
     *
     * 0 = boucle infinie
     */
    loops: 0,

    /*
     * Démarrer automatiquement.
     */
    autoplay: true

};

Object.assign(CONFIG, window.CTA_CONFIG || {});

const SHARE_TEXT = {
    stream: "Partage le stream",
    record: "Partage la vidéo"
}[window.CTA_VARIANT] || "Partage le stream";


/*
 * ---------------------------------------------------------
 * MESSAGES
 * ---------------------------------------------------------
 */

const messages = [

    {
        id: "like",

        icon: "👍",

        eyebrow: "Si tu apprécies",

        message: "Laisse un like",

        accent: "#3b82f6",

        shadow: "rgba(59, 130, 246, 0.45)"
    },

    {
        id: "comment",

        icon: "💬",

        eyebrow: "Ton avis compte",

        message: "Laisse un commentaire",

        accent: "#a855f7",

        shadow: "rgba(168, 85, 247, 0.45)"
    },

    {
        id: "share",

        icon: "↗",

        eyebrow: "Fais passer le mot",

        message: SHARE_TEXT,

        accent: "#14b8a6",

        shadow: "rgba(20, 184, 166, 0.45)"
    },

    {
        id: "subscribe",

        icon: "♥",

        eyebrow: "Pour ne rien manquer",

        message: "Abonne-toi !",

        accent: "#ef4444",

        shadow: "rgba(239, 68, 68, 0.5)"
    }

];


/*
 * ---------------------------------------------------------
 * ÉTAT
 * ---------------------------------------------------------
 */

let currentIndex = 0;
let currentLoop = 0;

let running = false;


/*
 * ---------------------------------------------------------
 * CONFIGURATION VISUELLE
 * ---------------------------------------------------------
 */

function setAccent(data) {

    cta.style.setProperty(
        "--accent",
        data.accent
    );

    cta.style.setProperty(
        "--accent-shadow",
        data.shadow
    );

    cta.style.setProperty(
        "--display-time",
        CONFIG.displayTime + "ms"
    );

}


/*
 * ---------------------------------------------------------
 * AFFICHAGE
 * ---------------------------------------------------------
 */

function showMessage(data) {

    /*
     * On retire temporairement l'animation.
     */
    cta.classList.remove("visible");

    /*
     * Permet de rejouer les animations CSS
     * même lorsque le message précédent était identique.
     */
    void cta.offsetWidth;

    icon.textContent = data.icon;

    eyebrow.textContent = data.eyebrow;

    message.textContent = data.message;

    setAccent(data);

    cta.classList.add("visible");

}


/*
 * ---------------------------------------------------------
 * MASQUAGE
 * ---------------------------------------------------------
 */

function hideMessage() {

    cta.classList.remove("visible");

}


/*
 * ---------------------------------------------------------
 * SÉQUENCE
 * ---------------------------------------------------------
 */

async function sleep(milliseconds) {

    return new Promise(
        resolve => setTimeout(
            resolve,
            milliseconds
        )
    );

}


async function playSequence() {

    if (running) {
        return;
    }

    running = true;

    currentIndex = 0;
    currentLoop = 0;

    while (
        CONFIG.loops === 0 ||
        currentLoop < CONFIG.loops
    ) {

        const data =
            messages[currentIndex];

        showMessage(data);

        await sleep(
            CONFIG.displayTime
        );

        hideMessage();

        await sleep(
            CONFIG.delayBetween
        );

        currentIndex++;

        if (
            currentIndex >=
            messages.length
        ) {

            currentIndex = 0;

            currentLoop++;

            /*
             * Pause entre deux boucles complètes.
             */
            if (
                CONFIG.loops === 0 ||
                currentLoop < CONFIG.loops
            ) {

                await sleep(
                    CONFIG.delayBetweenLoops
                );

            }

        }

    }

    running = false;

}


/*
 * ---------------------------------------------------------
 * API POUR OBS / TÉLÉCOMMANDE
 * ---------------------------------------------------------
 *
 * Ces fonctions sont exposées sur window.
 *
 * Tu peux donc plus tard appeler :
 *
 * showCTA()
 * hideCTA()
 * nextCTA()
 * restartCTA()
 *
 * depuis une télécommande ou une autre interface.
 *
 * ---------------------------------------------------------
 */

window.showCTA = function () {

    const data =
        messages[currentIndex];

    showMessage(data);

};


window.hideCTA = function () {

    hideMessage();

};


window.nextCTA = function () {

    currentIndex =
        (currentIndex + 1)
        % messages.length;

    showMessage(
        messages[currentIndex]
    );

};


window.restartCTA = function () {

    running = false;

    currentIndex = 0;
    currentLoop = 0;

    hideMessage();

    setTimeout(
        playSequence,
        100
    );

};


/*
 * ---------------------------------------------------------
 * DÉMARRAGE
 * ---------------------------------------------------------
 */

if (CONFIG.autoplay) {

    /*
     * Petit délai pour éviter que l'overlay apparaisse
     * instantanément au chargement de la source OBS.
     */

    setTimeout(
        playSequence,
        1200
    );

}
