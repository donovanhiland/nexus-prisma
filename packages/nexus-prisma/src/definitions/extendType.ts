import { core, extendType } from 'nexus'
import {
  PrismaExtendTypeBlock,
  prismaExtendTypeBlock,
  prismaTypeExtend,
} from '../blocks/extendType'
import { isPrismaSchemaBuilder, PrismaSchemaBuilder } from '../builder'
import { PrismaObjectTypeNames } from '../types'

export interface PrismaExtendTypeConfig<TypeName extends string>
  extends core.Omit<core.NexusExtendTypeConfig<TypeName>, 'definition'> {
  definition: (t: PrismaExtendTypeBlock<TypeName>) => void
}

export function prismaExtendType<TypeName extends PrismaObjectTypeNames>(
  typeConfig: PrismaExtendTypeConfig<TypeName>,
  // @ts-ignore
): core.NexusWrappedType<core.NexusExtendTypeDef<TypeName>> {
  // @ts-ignore
  return core.nexusWrappedType(typeConfig.type, builder => {
    if (!isPrismaSchemaBuilder(builder)) {
      throw new Error('prismaExtendType can only be used by `makePrismaSchema`')
    }

    return nexusExtendType(typeConfig, builder)
  })
}

function nexusExtendType<TypeName extends string>(
  typeConfig: PrismaExtendTypeConfig<TypeName>,
  builder: PrismaSchemaBuilder,
): core.NexusExtendTypeDef<TypeName> {
  let { definition, ...rest } = typeConfig
  const nexusPrismaSchema = builder.getNexusPrismaSchema()
  const prismaType = prismaTypeExtend(
    nexusPrismaSchema,
    typeConfig,
    builder.getConfig(),
  )

  return extendType({
    ...rest,
    definition(block) {
      const prismaBlock = prismaExtendTypeBlock(
        typeConfig.type,
        block,
        prismaType,
        nexusPrismaSchema.schema,
      )

      definition(prismaBlock)
    },
  })
}
