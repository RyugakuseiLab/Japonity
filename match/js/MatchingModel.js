// ユーザーとマッチする人がDB上にいないかチェック
export class MatchingModel {
  constructor (props) {
    this.userId = props.userId
    this.lang = props.lang
    this.level = props.level
    this.init()
  }

  init () {

  }
}

export default MatchingModel
