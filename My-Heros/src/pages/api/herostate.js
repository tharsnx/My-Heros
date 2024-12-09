export async function getHerostate() {
    const response = await fetch('https://api.opendota.com/api/heroStats');
    const heroesstate = await response.json();

    return{
        props:{
            heroesstate,
        },
    };
}

export default getHerostate;