import type { LyricLine, LyricsData } from '~/types'

// Local lyrics data - will be replaced by API calls later
const localLyricsData: Record<number, LyricLine[]> = {
  1: [
    { time: 0, text: '...' },
    { time: 15, text: 'De nos jours plus rien de va,' },
    { time: 17, text: 'Que ce soit ici ou là-bas,' },
    { time: 20, text: 'Ils sont ici pour nous faire chier' },
    { time: 23, text: 'Je parle bien sur des étrangers !' },
    { time: 26, text: 'Il y en a de toute sorte,' },
    { time: 28, text: "C'est comme des cartes pokémon," },
    { time: 31, text: 'Mais malheureusement sur leur carte' },
    { time: 33, text: 'Que des statistiques qui déconnent !' },
    { time: 36, text: 'On ne veut aussi pas les collectionner !' },
    { time: 39, text: "Car un pokédex c'est fait pour être parfait" },
    { time: 42, text: "La dernière fois que j'en ai vu" },
    { time: 44, text: "C'était pour leur cracher dessus." },
    { time: 49, text: "Les Arabes c'est dehors !" },
    { time: 52, text: "On n'en veut plus dans le décor !" },
    { time: 55, text: "Les maghrébins c'est dehors !" },
    { time: 57, text: "Impossible qu'ils ne s'améliorent !" },
    { time: 60, text: "Les bridés c'est dehors !" },
    { time: 63, text: 'Ce ne sont pas des trésor !' },
    { time: 65, text: "Les négros c'est dehors !" },
    { time: 68, text: 'Ah non pas eux,' },
    { time: 69, text: 'On en veut pour nos champs !' },
    { time: 72, text: '...' },
    { time: 76, text: "Avec la monté de l'extrême droite" },
    { time: 79, text: "Oh mon dieu qu'elle aubaine" },
    { time: 81, text: 'Depuis maintenant quelques années à droites' },
    { time: 84, text: 'On voit cette magnifique Madame Le Pen' },
    { time: 87, text: 'Ça lui a valu la prison' },
    { time: 90, text: 'Justice imparfaite' },
    { time: 92, text: 'Heureusement, il est bientôt là,' },
    { time: 95, text: 'On le verra en 2027' },
    { time: 97, text: 'Je parle bien sûr de ce magnifique Bardella !' },
    { time: 100, text: "Certains pensent qu'il n'a aucune chance" },
    { time: 103, text: 'Moi je pense qu\'il peut se hisser' },
    { time: 105, text: "Avec sa beauté d'esprit et son intelligence" },
    { time: 108, text: 'Sur le siège le plus haut et le plus prisé de France' },
    { time: 114, text: "Les Arabes c'est dehors !" },
    { time: 117, text: "On n'en veut plus dans le décor !" },
    { time: 120, text: "Les maghrébins c'est dehors !" },
    { time: 123, text: "Impossible qu'ils ne s'améliorent !" },
    { time: 126, text: "Les bridés c'est dehors !" },
    { time: 128, text: 'Ce ne sont pas des trésor !' },
    { time: 130, text: "Les négros c'est dehors !" },
    { time: 133, text: 'Ah non pas eux,' },
    { time: 135, text: 'On en veut pour nos champs !' },
    { time: 137, text: '...' },
    { time: 138, text: 'On les sent à 10 000' },
    { time: 139, text: 'Et ça remplit nos narines' },
    { time: 140, text: "Ce n'est pas de la vanille" },
    { time: 142, text: 'Mais je dirais des latrines' },
    { time: 143, text: 'Avec un mélange de poubelles' },
    { time: 145, text: "Qu'on utilise pour le compost" },
    { time: 148, text: "Bien pourris au fond d'une ruelle" },
    { time: 151, text: "Où n'y va même pas la poste" },
    { time: 153, text: 'Ça sent même la marée basse' },
    { time: 156, text: "Pas étonnant vu qu'ils y meurent" },
    { time: 159, text: 'On leur dit buvez pas la tasse' },
    { time: 161, text: 'Mais ils sont plus cons que des chômeurs' },
    { time: 169, text: "Les Arabes c'est dehors !" },
    { time: 172, text: 'Hey ! Hey ! Hey ! Hey !' },
    { time: 175, text: "Les Magrébins c'est dehors !" },
    { time: 177, text: 'Hey ! Hey ! Hey ! Hey !' },
    { time: 185, text: "Les Arabes c'est dehors !" },
    { time: 188, text: "On n'en veut plus dans le décor !" },
    { time: 191, text: "Les maghrébins c'est dehors !" },
    { time: 193, text: "Impossible qu'ils ne s'améliorent !" },
    { time: 196, text: "Les bridés c'est dehors !" },
    { time: 199, text: 'Ce ne sont pas des trésor !' },
    { time: 202, text: "Les négros c'est dehors !" },
    { time: 204, text: 'Ah non pas eux,' },
    { time: 206, text: 'On en veut pour nos champs !' },
  ],
  101: [
    { time: 0, text: '...' },
    { time: 7, text: 'C\'est la belle nuit de Noël' },
    { time: 7, text: 'Ma lance est dans son manteau blanc' },
    { time: 10, text: 'Et mon gland levé vers le ciel' },
    { time: 18, text: 'A genoux les demandant' },
    { time: 22, text: 'Avant de fermer les paupières' },
    { time: 26, text: 'Buvons une dernière bière' },
    { time: 29, text: 'Petit papa Noël' },
    { time: 32, text: 'Quand tu descendras du ciel' },
    { time: 36, text: 'Avec des dildos par milliers' },
    { time: 40, text: 'N\'oublie pas mon petit gode michet' },
    { time: 44, text: 'Mais avant de partir' },
    { time: 47, text: 'Il faudra bien me faire jouir' },
    { time: 51, text: 'Tu n\'as qu\'à penser à Gaïa' },
    { time: 55, text: 'Pour la mettre au fond de moi' },
    { time: 59, text: 'Il me tarde tant que le jour se lève' },
    { time: 63, text: 'Pour voir si tu m\'as inséré' },
    { time: 66, text: 'Tous les beaux joujous que je vois en rêve' },
    { time: 70, text: 'Et que je t\'ai commandé' },
    { time: 74, text: 'Petit papa Noël' },
    { time: 77, text: 'Quand tu descendras du ciel' },
    { time: 81, text: 'Avec des dildos par milliers' },
    { time: 85, text: 'N\'oublie pas mon petit gode michet' },
    { time: 104, text: 'Le roumain est passé' },
    { time: 108, text: 'Certains vont se faire sodo' },
    { time: 112, text: 'Et tu vas pouvoir commencer' },
    { time: 115, text: 'Avec ta capote sur le barreau' },
    { time: 119, text: 'Au son des cloches des églises' },
    { time: 123, text: 'Les prêtres auront une surprise' },
    { time: 127, text: 'Et quand tu gicleras sur mon visage' },
    { time: 131, text: 'C\'est comme ça que nous baiserons' },
    { time: 134, text: 'Je n\'ai pas été tous les jours très sage' },
    { time: 138, text: 'Punis-moi pour mon pardon' },
    { time: 141, text: 'Petit papa Noël' },
    { time: 145, text: 'Quand tu descendras du ciel' },
    { time: 149, text: 'Avec des dildos par milliers' },
    { time: 153, text: 'N\'oublie pas mon petit gode michet' },
    { time: 156, text: 'Petit papa Noël' },
  ],
  102: [
    { time: 0, text: '...' },
    { time: 14, text: 'Douce nuit, sainte nuit,' },
    { time: 19, text: 'Dans mon lit, l\'astre luit' },
    { time: 24, text: 'Du haut de son centimètre,' },
    { time: 29, text: 'Il aimerait bien lui mettre' },
    { time: 32, text: 'C\'est l\'amour infini, c\'est l\'amour infini' },
    { time: 40, text: 'Saint-Soldat, Saint barreau' },
    { time: 44, text: 'Qu\'il est grand, qu\'il est beau' },
    { time: 48, text: 'Il aimerait bien se faire sauter' },
    { time: 52, text: 'Mais toujours au fond de son tombeau' },
    { time: 56, text: 'Vers son humble berceau, vers son humble berceau' },
    { time: 64, text: 'Oh là là, qu\'il est court' },
    { time: 68, text: 'Il faudra que je la bourre' },
    { time: 72, text: 'Je ne ferai pas de gros détour' },
    { time: 76, text: 'Je ne ferai pas de demi-tour' },
    { time: 80, text: 'Comme la dinde de Noël Comme la dinde de Noël' },
    { time: 88, text: 'C\'est fini, j\'ai joui' },
    { time: 92, text: 'Tout au fond de mon lit' },
    { time: 96, text: 'Mère Noël, est-ce que tu es contente' },
    { time: 100, text: 'Tu me le disais, je suis partante' },
    { time: 104, text: 'Et cela depuis mille ans Et cela depuis mille ans' }, 
    { time: 112, text: 'Je suis prête pour la tournée' },
    { time: 116, text: 'Mère Noël, je reviendrai' },
    { time: 120, text: 'Prend soin de mes lutins préférés' },
    { time: 124, text: 'Ils ont besoin de se masturber' },
    { time: 128, text: 'Ils ne l\'ont pas fait durant une année' },
    { time: 132, text: 'Ils ne l\'ont pas fait durant une année' },
  ],
  103: [
    { time: 0, text: '...' },
    { time: 3, text: 'Il est levé le divin soldat,' },
    { time: 7, text: 'Tous à poil et on se caresse,' },
    { time: 11, text: 'Il est levé le divin soldat,' },
    { time: 15, text: 'Venez tous avant qu\'il se rabaisse.' },
    { time: 18, text: 'Pour Noël j\'ai pris du Viagra,' },
    { time: 22, text: 'Mais j\'ai peur de lever la table,' },
    { time: 26, text: 'Pour Noël j\'ai pris du Viagra,' },
    { time: 30, text: 'Mais elle n\'est pas si redoutable.' },
    { time: 33, text: 'Il est levé le divin soldat,' },
    { time: 37, text: 'Tous à poil et on se caresse,' },
    { time: 41, text: 'Il est levé le divin soldat,' },
    { time: 45, text: 'Venez tous avant qu\'il se rabaisse.' },
    { time: 49, text: 'J\'ai hâte d\'ouvrir mon cadeau,' },
    { time: 53, text: 'Mais faut attendre le gateau.' },
    { time: 57, text: 'J\'ai hâte d\'ouvrir mon cadeau,' },
    { time: 60, text: 'Pour voir si j\'ai eu mon vibro.' },
    { time: 64, text: 'Il est levé le divin soldat,' },
    { time: 68, text: 'Tous à poil et on se caresse,' },
    { time: 72, text: 'Il est levé le divin soldat,' },
    { time: 76, text: 'Venez tous avant qu\'il se rabaisse.' },
    { time: 79, text: 'Partez ! Il faut que je l\'essaie,' },
    { time: 83, text: 'Pour voir si je peux faire la fête.' },
    { time: 87, text: 'Partez ! Il faut que je l\'essaie,' },
    { time: 91, text: 'Je voudrais le faire en cachette.' },
    { time: 94, text: 'Il est levé le divin soldat,' },
    { time: 98, text: 'Tous à poil et on se caresse,' },
    { time: 102, text: 'Il est levé le divin soldat,' },
    { time: 106, text: 'Venez tous avant qu\'il se rabaisse.' },
    { time: 109, text: 'Oh Jésus, oh roi tout puissant,' },
    { time: 113, text: 'Pourrais-tu te réincarner ?' },
    { time: 117, text: 'Oh Jésus, oh roi tout puissant,' },
    { time: 121, text: 'Prends contrôle de mon gode michet !' },
    { time: 125, text: 'Il est levé le divin soldat,' },
    { time: 129, text: 'Tous à poil et on se caresse,' },
    { time: 133, text: 'Il est levé le divin soldat,' },
    { time: 137, text: 'Venez tous avant qu\'il se rabaisse.' },
    { time: 141, text: '...' },
  ],
  104: [
    { time: 0, text: '...' },
    { time: 13, text: 'Mon beau gros sexe, roi adoré,' },
    { time: 16, text: 'Qu\'il aime bien ta rayure,' },
    { time: 20, text: 'Quand par l\'hiver il disparaît' },
    { time: 23, text: 'Avec le froid désespéré.' },
    { time: 26, text: 'Mon beau gros sexe, roi adoré,' },
    { time: 30, text: 'Tu perds ta carrure.' },
    { time: 33, text: 'Quand vient Noël, tout décoré,' },
    { time: 36, text: 'Mon cadeau est arrivé.' },
    { time: 40, text: 'Mamie a eu un godmichet,' },
    { time: 43, text: 'Et c\'est pareil pour notre pépé.' },
    { time: 46, text: 'Quand vient Noël, tout décoré,' },
    { time: 50, text: 'Mon cadeau est employé.' },
    { time: 57, text: 'Celui de Louis, il est tout mou,' },
    { time: 61, text: 'Bien qu\'il soit toujours en l\'air.' },
    { time: 65, text: 'Petit zizi, tout petit bout,' },
    { time: 68, text: 'Et ses guirlandes et ses joujoux.' },
    { time: 71, text: 'Celui de Louis, il est tout mou,' },
    { time: 75, text: 'Il n\'a jamais fait la guerre.' },
    { time: 78, text: 'Quand vient Noël, tout décoré,' },
    { time: 81, text: 'Mon cadeau est arrivé.' },
    { time: 86, text: 'Mamie a eu un godmichet,' },
    { time: 89, text: 'Et c\'est pareil pour notre pépé.' },
    { time: 92, text: 'Quand vient Noël, tout décoré,' },
    { time: 95, text: 'Mon cadeau est employé.' },
    { time: 104, text: 'Mon beau gros sexe, ton grand sommet,' },
    { time: 108, text: 'Et son fidèle ombrage,' },
    { time: 111, text: 'À côté de celui des autres,' },
    { time: 114, text: 'Qui n\'a jamais touché leur côte.' },
    { time: 117, text: 'Mon beau gros sexe, ton grand sommet,' },
    { time: 121, text: 'Il est en plein raffinage.' },
    { time: 124, text: 'Quand vient Noël, tout décoré,' },
    { time: 128, text: 'Mon cadeau est arrivé.' },
    { time: 131, text: 'Mamie a eu un godmichet,' },
    { time: 134, text: 'Et c\'est pareil pour notre pépé.' },
    { time: 137, text: 'Quand vient Noël, tout décoré,' },
    { time: 141, text: 'Mon cadeau est employé.' },
    { time: 149, text: 'Celui de Lucas, il ne bouge pas,' },
    { time: 153, text: 'C\'est un personnage passif.' },
    { time: 156, text: 'Malgré le froid, elle ne bouge pas,' },
    { time: 160, text: 'Qu\'il y ait Louis ou bien Gaïa.' },
    { time: 163, text: 'Celui de Lucas, il ne bouge pas,' },
    { time: 166, text: 'C\'est un personnage non actif.' },
    { time: 170, text: 'Quand vient Noël, tout décoré,' },
    { time: 173, text: 'Mon cadeau est arrivé.' },
    { time: 176, text: 'Mamie a eu un godmichet,' },
    { time: 180, text: 'Et c\'est pareil pour notre pépé.' },
    { time: 183, text: 'Quand vient Noël, tout décoré,' },
    { time: 187, text: 'Mon cadeau est employé.' },
  ],
  105: [
    { time: 0, text: '...' },
    { time: 12, text: 'Pour notre dernière chanson, on vous sort notre meilleur son' },
    { time: 17, text: 'On vous partage des anecdotes, sans que Louis ne baisse son froc' },
    { time: 24, text: 'En parlant de fiak, on voulait parler de Gaïa et de sa chatte' },
    { time: 30, text: 'Caressé par un Mathis pas ouf, qui s\'est perdu dans sa touffe' },
    { time: 36, text: 'Du haut de la CN Tower, pour certains c\'est leur rêve de coeur' },
    { time: 42, text: 'La la la dans le fiak, la la la la dans sa chatte' },
    { time: 50, text: 'C\'est la fin de la mobi, on part presque tous d\'ici' },
    { time: 56, text: 'Au revoir Chicoutimi, on reviendra c\'est promis' },
    { time: 62, text: 'Lucas toujours AFK, quand il est là on ne le sait pas' },
    { time: 69, text: '11 purple, tu es notre roi, c\'est passé comme dans Gaïa' },
    { time: 76, text: 'C\'est Louis qui a tout bu, avant de nous montrer son cul' },
    { time: 82, text: 'Gaïa en a vomi, dans une casserole toute la nuit' },
    { time: 88, text: 'C\'est la fin de la mobi, on part presque tous d\'ici' },
    { time: 93, text: 'Au revoir Chicoutimi, on reviendra c\'est promis' },
    { time: 99, text: 'En revenant sur Toronto, Chinatown, c\'est pas beau' },
    { time: 104, text: 'Oh putain Laurent, avec les flics c\'est pas marrant' },
    { time: 108, text: 'Chatime donne des frissons à cause des clés tout sur le paillasson' },
    { time: 113, text: 'Shawarma ou pizza, que des dilemmes sans choix' },
    { time: 119, text: 'Entre deux tatouages on a choisi, celui qu\'on préfère celui des nazis' },
    { time: 126, text: 'C\'est la fin de la mobi, on part presque tous d\'ici' },
    { time: 132, text: 'Au revoir Chicoutimi, on reviendra c\'est promis' },
    { time: 139, text: 'Dans ce groupe chacun a des défauts, même si Louis a le plus gros' },
    { time: 143, text: 'Gaïa est une grosse guauchiasse, qui soutire le Hamas' },
    { time: 149, text: 'Tandis que Lucas est écolo, voulant son bilan carbone à zéro' },
    { time: 155, text: 'Pour Louis les tips n\'existent pas, sauf pour le gars avec les pizzas' },
    { time: 161, text: 'Il ne sait pas non plus faire les accents, Tabarnak, Calisse, Chris, Poutine vraiment' },
    { time: 167, text: 'C\'est la fin de la mobi, on part presque tous d\'ici' },
    { time: 173, text: 'Au revoir Chicoutimi, on reviendra c\'est promis' },
    { time: 180, text: 'Pour notre dernière soirée au bistrot, un bras de fer n\'est pas de trop' },
    { time: 184, text: 'Même si Enrique a abusé avec la mère de Louis tanée' },
    { time: 187, text: 'Gaïa partant avec Samuel qui voulait l\'envoyer au septième ciel' },
    { time: 190, text: 'Louis partant avec son gland, personne ne l\'a trouvé charmant' },
    { time: 193, text: 'Ni Maylouane, ni Mariga n\'a pu être pour lui les chutes du Niagara' },
    { time: 198, text: 'C\'est la fin de la mobi, on part presque tous d\'ici' },
    { time: 204, text: 'Au revoir Chicoutimi, on reviendra c\'est promis' },
    { time: 210, text: 'C\'est la fin de la mobi, on part presque tous d\'ici' },
    { time: 216, text: 'Au revoir Chicoutimi, on reviendra c\'est promis' },
  ],
  
  106: [
    { time: 0, text: '...' },
    { time: 6, text: 'Vive Chicout\', vive Chicout\' !' },
    { time: 9, text: 'Vive Chicout\' l\'hiver !' },
    { time: 13, text: 'Qui s\'en prend derrière, devant !' },
    { time: 16, text: 'Louis en garde un goût amer !' },
    { time: 19, text: 'OOOH ! Vive Chicout\', vive Chicout\' !' },
    { time: 22, text: 'Vive Chicout\' l\'hiver !' },
    { time: 26, text: 'Boules de sperme et jour de gland !' },
    { time: 29, text: 'Et paf dans le cul d\'ta mère !' },
    { time: 32, text: 'Sur le long chemin,' },
    { time: 35, text: 'Quand Gaïa se déhanche,' },
    { time: 38, text: 'Un vieux monsieur s\'avance,' },
    { time: 42, text: 'Lucas ne dira rien,' },
    { time: 45, text: 'Louis n\'est pas content,' },
    { time: 48, text: 'La guerre se déclenche' },
    { time: 52, text: 'Il lui attrape la panse,' },
    { time: 55, text: 'Jusqu\'à ne plus avoir de sang ! OOOH' },
    { time: 58, text: 'Vive Chicout\', vive Chicout\' !' },
    { time: 62, text: 'Vive Chicout\' l\'hiver !' },
    { time: 65, text: 'Qui s\'en prend derrière, devant !' },
    { time: 68, text: 'Louis en garde un goût amer !' },
    { time: 72, text: 'Vive Chicout\', vive Chicout\' !' },
    { time: 75, text: 'Vive Chicout\' l\'hiver !' },
    { time: 78, text: 'Boules de sperme et jour de gland !' },
    { time: 82, text: 'Et paf dans le cul d\'ta mère !' },
    { time: 88, text: 'Mais le vieux monsieur,' },
    { time: 92, text: 'Venant de ce village,' },
    { time: 94, text: 'Yves n\'est pas très sage,' },
    { time: 98, text: 'Dans son slip c\'est le feu' },
    { time: 100, text: 'À en perdre la raison,' },
    { time: 104, text: 'jusqu\'à la grosse giclette,' },
    { time: 107, text: 'Partout s\'en jette,' },
    { time: 110, text: 'bien plus que ses estimations ! OOOH' },
    { time: 114, text: 'Vive Chicout\', vive Chicout\' !' },
    { time: 118, text: 'Vive Chicout\' l\'hiver !' },
    { time: 120, text: 'Qui s\'en prend derrière, devant !' },
    { time: 124, text: 'Louis en garde un goût amer !' },
    { time: 127, text: 'Vive Chicout\', vive Chicout\' !' },
    { time: 130, text: 'Vive Chicout\' l\'hiver !' },
    { time: 133, text: 'Boules de sperme et jour de gland !' },
    { time: 136, text: 'Et paf dans le cul d\'ta mère !' },
    { time: 140, text: 'Joyeux, joyeux Noël !' },
    { time: 143, text: 'Aux mille gâteries...' },
    { time: 146, text: 'Mathis le démentiel,' },
    { time: 150, text: 'Gaïa ne nous a pas choisi OOOH' },
    { time: 153, text: 'Vive Chicout\', vive Chicout\' !' },
    { time: 156, text: 'Vive Chicout\' l\'hiver !' },
    { time: 160, text: 'Qui s\'en prend derrière, devant !' },
    { time: 163, text: 'Louis en garde un goût amer !' },
    { time: 166, text: 'Vive Chicout\', vive Chicout\' !' },
    { time: 169, text: 'Vive Chicout\' l\'hiver !' },
    { time: 173, text: 'Boules de sperme et jour de gland !' },
    { time: 176, text: 'Et paf dans le cul d\'ta mère !' },
  ],
}

export function useLyrics(trackId: Ref<number>) {
  const lyrics = ref<LyricLine[]>([])
  const currentTime = ref(0)
  const isLoading = ref(false)

  // Fetch lyrics for a track
  const fetchLyrics = async (): Promise<void> => {
    isLoading.value = true

    // TODO: Replace with API call when backend is ready
    // const { get } = useApi()
    // const response = await get<LyricsData>(`/tracks/${trackId.value}/lyrics`)
    // if (response.success) {
    //   lyrics.value = response.data.lines
    // }

    // For now, use local data
    lyrics.value = localLyricsData[trackId.value] || []
    isLoading.value = false
  }

  // Current lyric index based on time
  const currentLyricIndex = computed(() => {
    const time = currentTime.value
    for (let i = lyrics.value.length - 1; i >= 0; i--) {
      const lyric = lyrics.value[i]
      if (lyric && time >= lyric.time) {
        return i
      }
    }
    return 0
  })

  // Previous, current, and next lyrics
  const previousLyric = computed(() => {
    const idx = currentLyricIndex.value
    return idx > 0 ? lyrics.value[idx - 1]?.text ?? '' : ''
  })

  const currentLyric = computed(() => {
    return lyrics.value[currentLyricIndex.value]?.text ?? ''
  })

  const nextLyric = computed(() => {
    const idx = currentLyricIndex.value
    return idx < lyrics.value.length - 1 ? lyrics.value[idx + 1]?.text ?? '' : ''
  })

  // Check if track has lyrics
  const hasLyrics = computed(() => {
    return trackId.value in localLyricsData
  })

  // Update current time (called from audio player)
  const updateTime = (time: number) => {
    currentTime.value = time
  }

  // Watch for track changes
  watch(trackId, () => {
    fetchLyrics()
  }, { immediate: true })

  return {
    // State
    lyrics: readonly(lyrics),
    isLoading: readonly(isLoading),
    currentLyricIndex,
    previousLyric,
    currentLyric,
    nextLyric,
    hasLyrics,

    // Methods
    fetchLyrics,
    updateTime,
  }
}
