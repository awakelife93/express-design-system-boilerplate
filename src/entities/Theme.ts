import { ObjectID } from "mongodb";
import { Column, Entity, ObjectIdColumn } from "typeorm";
import { CommonEntity } from "./Common";

@Entity("theme")
export class Theme extends CommonEntity {
  @ObjectIdColumn({ comment: "고유키" })
  _id!: ObjectID;

  @Column({ unique: true, comment: "테마 이름" })
  name!: string;

  @Column({ comment: "테마에 포함되는 스타일 키값" })
  styles!: ObjectID[];

  @Column({ default: true, comment: "활성 여부" })
  isActive!: boolean;

  @Column({ default: false, comment: "삭제 여부" })
  isDeleted!: boolean;

  findThemeItem() {
    return [
      // 사용 가능한 테마만...
      {
        $match: {
          isActive: true,
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "Style",
          let: { styleId: "$styles" },
          pipeline: [{ $match: { $expr: { $in: ["$_id", "$$styleId"] } } }],
          as: "styles",
        },
      },
      { $unwind: "$styles" },
      // 테마에 꽂혀있는 스타일중 사용 가능 한것만...
      {
        $match: {
          "styles.isActive": true,
          "styles.isDeleted": false,
        },
      },
      {
        $lookup: {
          from: "Layout",
          let: { layoutId: "$styles.layouts" },
          pipeline: [{ $match: { $expr: { $in: ["$_id", "$$layoutId"] } } }],
          as: "styles.layouts",
        },
      },
      {
        $lookup: {
          from: "Component",
          let: { componentId: "$styles.components" },
          pipeline: [{ $match: { $expr: { $in: ["$_id", "$$componentId"] } } }],
          as: "styles.components",
        },
      },
      // { $unwind: "$styles.layout" },
      // { $unwind: "$styles.component" },
    ];
  }
}
