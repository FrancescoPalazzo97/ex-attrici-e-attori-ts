export type Person = {
    readonly id: number,
    readonly name: string,
    birth_year: number,
    death_year?: number,
    biography: string,
    image: string
};

type ActressNationality =
    | 'American'
    | 'British'
    | 'Astrualian'
    | 'Israeli-American'
    | 'South African'
    | 'French'
    | 'Indian'
    | 'Israeli'
    | 'Spanish'
    | 'South Korean'
    | 'Chinese'

type ActorNationality =
    | ActressNationality
    | 'Scottish'
    | 'New Zealand'
    | 'Hong Kong'
    | 'German'
    | 'Canadian'
    | 'Irish'

export type Actress = Person & {
    most_famous_movies: [string, string, string],
    awards: string,
    nationality: ActressNationality
};

export type Actor = Person & {
    know_for: [string, string, string],
    awards: [string] | [string, string],
    nationality: ActorNationality
}