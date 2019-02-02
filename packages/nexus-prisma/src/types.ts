import { core } from 'nexus'

type GenTypesKeys = 'fields' | 'fieldsDetails' | 'enumTypesNames'

interface GenTypesShape {
  fields: Record<string, any>
  fieldsDetails: Record<string, any>
  enumTypesNames: string
}

export type GetGen<
  K extends GenTypesKeys,
  Fallback = any
> = NexusGen extends infer GenTypes
  ? GenTypes extends GenTypesShape
    ? GenTypes[K]
    : Fallback
  : Fallback

export type GetGen2<
  K extends GenTypesKeys,
  K2 extends keyof GenTypesShape[K]
> = NexusGen extends infer GenTypes
  ? GenTypes extends GenTypesShape
    ? K extends keyof GenTypes
      ? K2 extends keyof GenTypes[K]
        ? GenTypes[K][K2]
        : any
      : any
    : any
  : any

export interface ObjectField {
  name: string
  args?: string[] | false
  alias?: string
}

export type AnonymousField = string | ObjectField

export interface AnonymousPickOmitField {
  pick?: AnonymousField[]
  omit?: AnonymousField[]
}

export type AnonymousInputFields = AnonymousField[] | AnonymousPickOmitField

export interface PrismaOutputOpts {
  args: Record<string, core.NexusArgDef<string>>
  description?: string | null
  list: true | null
  nullable: boolean
  resolve: (root: any, args: any, ctx: any, info?: any) => any
}

export type PrismaOutputOptsMap = Record<string, PrismaOutputOpts>

export type InputField<TypeName extends string> = GetGen2<'fields', TypeName>

export type PrismaTypeNames = Extract<keyof GetGen<'fields', any>, string>

export type PrismaEnumTypeNames = NexusGen extends infer GenTypes
  ? GenTypes extends GenTypesShape
    ? GenTypes['enumTypesNames']
    : string
  : string

export interface PickInputField<TypeName extends string> {
  pick: InputField<TypeName>[]
}

export interface FilterInputField<TypeName extends string> {
  filter: ((fields: string[]) => string[]) | InputField<TypeName>[]
}

export type AddFieldInput<TypeName extends string> =
  | InputField<TypeName>[]
  | PickInputField<TypeName>
  | FilterInputField<TypeName>

export type PrismaObject<TypeName extends string> = GetGen2<
  'fieldsDetails',
  TypeName
>

export interface PrismaSchemaConfig extends core.BuilderConfig {
  types: any
  prisma: {
    schemaPath: string
    contextClientName: string
  }
}