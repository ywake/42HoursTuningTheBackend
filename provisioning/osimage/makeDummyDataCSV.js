/**
 * ダミーデータ用のCSVを作成するツール。
 */

const fs = require("fs");
const dummy = require("./dummyString");
const dirName = 'baseCSV/'

const debug = false;

const base = 1;
const fileBaseNum = 1000;

const categoryNum = 10;
const areaNum = 100;
const areaGroupNum = 5;

const userNum = 100000;
const recordNum = !debug ? 1000000 : 10000;

const groupNum = 500;

const secondaryNum = areaNum * categoryNum;

const openRatioInverse = 10;

const recordIdCreatedAt = {};

const getRecordCreatedAtStr = (recordId, diffSec) => {
	const toStrNum = (num) => {
		if (num < 10) {
			return `0${num}`
		}
		return `${num}`;
	}
	const genStr = (sec) => {
		const dateObj = new Date(sec * 1000);
		const fullYear = dateObj.getUTCFullYear();
		const month = dateObj.getUTCMonth() + 1;
		const date = dateObj.getUTCDate();
		const hour = dateObj.getUTCHours();
		const minute = dateObj.getUTCMinutes();
		const second = dateObj.getUTCSeconds();
		return `${fullYear}-${toStrNum(month)}-${toStrNum(date)} ${toStrNum(hour)}:${toStrNum(minute)}:${toStrNum(second)}`;
	}

	if (recordIdCreatedAt[`${recordId}`] !== undefined) {
		return genStr(recordIdCreatedAt[`${recordId}`] + diffSec);
	}

	const start = 1639839600;
	const interval = Math.floor(8640000 / 60);

	const v = Math.floor(Math.random() * interval);

	recordIdCreatedAt[`${recordId}`] = start + (v * 60) + 30;

	return genStr(recordIdCreatedAt[`${recordId}`] + diffSec);
}

let limit = base + userNum;
let user = "user_id,name,kana"
let session = "session_id,value,linked_user_id,created_at";
for (let i = base; i < limit;i++) {
	user+=`\n${i},${dummy.getUserName(i)},kana${i}`;
	session+=`\n${i},user${i},${i},2000-01-01 00:00:00`;
}

limit = base + categoryNum;
let category = "category_id,name";
category+=`\n1,緊急の対応が必要`;
category+=`\n2,故障・不具合(大型)`;
category+=`\n3,故障・不具合(中型・小型)`;
category+=`\n4,異常の疑い(大型)`;
category+=`\n5,異常の疑い(中型・小型)`;
category+=`\n6,お客様からの問い合わせ`;
category+=`\n7,オフィス外装・インフラ`;
category+=`\n8,貸与品関連`;
category+=`\n9,オフィス備品`;
category+=`\n10,その他`;

limit = base + groupNum + secondaryNum;
let group = "group_id,name,kana"
for (let i = base; i < limit;i++) {
	group+=`\n${i},${dummy.getGroupName(i)},kana${i}`
}

// セカンダリ組織は、エリア内の全てのグループの特定のカテゴリを見る。
let category_group = "group_id,category_id,application_group"
for (let i = base + groupNum; i < limit; i++) {
	const targetGroupId = base + ((i - base - groupNum) * areaGroupNum % groupNum);
	for (let j = 0; j < areaGroupNum; j++) {
		category_group+=`\n${i},${(i - 1) % categoryNum + base},${targetGroupId + j}`;
	}
}

// 1ユーザは、申請用のプライマリ組織 + 閲覧用のセカンダリ組織に一つ所属。
limit = base + userNum;
group_member= "group_id,user_id,is_primary"
for (let i = base; i < limit;i++) {
	group_member+=`\n${(i - 1) % groupNum + base},${i},1`
	group_member+=`\n${(i - 1) % secondaryNum + ( base + groupNum)},${i},0`
}

const writeRecordCSV = () => {
	// 1割がオープン。
	const loop = Math.floor(recordNum / (groupNum * categoryNum));
	let record = "record_id,status,title,category_id,application_group,created_by,created_at,updated_at,detail";
	let detail=`${dummy.getDetail()}`;
	let i = base;
	let u = base;
	//各申請組織、各カテゴリーごとに。
	//500 * 10 5000 通りの申請。 loopは2000回。
	for (let g = 0; g < groupNum; g++) {
		for (let c = 0; c < categoryNum; c++) {
			for (let l = 0; l < loop; l++) {
				const status = l < (loop / openRatioInverse) ? 'open' : 'closed';
				const createdBy = status === 'open' ? `${(u++) % userNum}` :`${(i - 1) % userNum + base}`
				record+=`\n${i},${status},${dummy.getTitle(i)},${(c) % categoryNum + base},${(g) % groupNum + base},`;
				record+=`${createdBy},${getRecordCreatedAtStr(i, 0)},${getRecordCreatedAtStr(i, 1501)},`;
				record+=`${detail}`;
				i++;
			}
		}
	}

	record+=`\na,closed,t,1,${base + groupNum + secondaryNum + 2},${base + userNum + 2},`;
	record+=`2022-03-31 01:00:00,2022-03-31 09:00:00,d`;
	record+=`\nc,closed,t,1,${base + groupNum + secondaryNum + 2},${base + userNum + 2},`;
	record+=`2022-03-31 02:00:00,2022-03-31 09:00:00,d`;
	record+=`\nb,closed,t,1,${base + groupNum + secondaryNum + 2},${base + userNum + 2},`;
	record+=`2022-03-31 03:00:00,2022-03-31 09:00:00,d`;

	console.log('out record');
	fs.writeFileSync(`${dirName}record.csv`, record);
}

writeRecordCSV();

const writeRecordLinkedCSV1 = () => {

	//1レコード4コメント。２ユーザでやりとり。
	let limit = base + recordNum;
	let record_comment = "comment_id,linked_record_id,created_by,created_at,value";
	for (let i = base; i < limit;i++) {
		record_comment+=`\n${base + (i - base) * 4 + 0},${i},${(i - 1 + 0) % userNum + base},${getRecordCreatedAtStr(i, 724)},`;
		record_comment+=`報告内容、確認しました。この症状がで始めたのはおおよそいつごろからかを教えていただくことはできますか。お願いします。`;
		record_comment+=`\n${base + (i - base) * 4 + 1},${i},${(i - 1 + 1) % userNum + base},${getRecordCreatedAtStr(i, 937)},`;
		record_comment+=`お世話になっております。先月の東三宅への貸し出しが決まった際の点検では問題がなかったのですが、それ以降いつ起きたのかは分かっていません。`;
		record_comment+=`\n${base + (i - base) * 4 + 2},${i},${(i - 1 + 0) % userNum + base},${getRecordCreatedAtStr(i, 1202)},`;
		record_comment+=`事情わかりました。ここが使えないと影響がありそうなので、修理業者を依頼しておきます。来週ごろには修理に出せると思います。`;
		record_comment+=`\n${base + (i - base) * 4 + 3},${i},${(i - 1 + 1) % userNum + base},${getRecordCreatedAtStr(i, 1501)},`;
		record_comment+=`承知しました、ありがとうございます！しばらくの貸出予定はないので、一旦貸出可能リストから外しておきます。よろしくお願いいたします。`;
	}

	console.log('out record linked 1');
	fs.writeFileSync(`${dirName}record_comment.csv`, record_comment);
}

const writeRecordLinkedCSV2 = () => {

	//1レコードあたり添付ファイル2件。
	let limit = base + recordNum;
	let record_file = "item_id,linked_record_id,linked_file_id,linked_thumbnail_file_id,created_at";
	let file = "file_id,path,name";
	const path = "file/static/"
	for (let i = base; i < limit;i++) {
		const itemId = base + (i - base) * 2;
		const fileName = `f${((i - base) % fileBaseNum) + 1}.jpg`;
		const fileName2 = `f${((i - base + 1) % fileBaseNum) + 1}.jpg`;

		record_file+=`\n${itemId + 0},${i},file_${itemId + 0},thumb_${itemId + 0},${getRecordCreatedAtStr(i, 0)}`;
		record_file+=`\n${itemId + 1},${i},file_${itemId + 1},thumb_${itemId + 1},${getRecordCreatedAtStr(i, 1)}`;
		file+=`\nfile_${itemId + 0},${path}${fileName},${fileName}`;
		file+=`\nthumb_${itemId + 0},${path}thumb_${fileName},thumb_${fileName}`;
		file+=`\nfile_${itemId + 1},${path}${fileName2},${fileName2}`;
		file+=`\nthumb_${itemId + 1},${path}thumb_${fileName2},thumb_${fileName2}`;
	}

	//1レコードあたり、視聴者は6人。
	let record_last_access = "record_id,user_id,access_time";
	for (let i = base; i < limit;i++) {
		for (let j = 0; j < 6; j++) {
			const access_time = j % 2 == 0 ? `${getRecordCreatedAtStr(i, 1502)}` : `${getRecordCreatedAtStr(i, 1500)}`
			record_last_access+=`\n${i},${((i + j - 1) % userNum + base)},${access_time}`;
		}
	}

	console.log('out record linked 2');
	fs.writeFileSync(`${dirName}record_item_file.csv`, record_file);
	fs.writeFileSync(`${dirName}file.csv`, file);
	fs.writeFileSync(`${dirName}record_last_access.csv`, record_last_access);
}

writeRecordLinkedCSV1();
writeRecordLinkedCSV2();


//APIテスト用。変更する場合はcheck.jsも変更必要。
// user1は 1と2 user2は2
// 1は 1-1,1-2 2は2-3
user+=`\n${base + userNum + 0},ds,kanaD`;
user+=`\n${base + userNum + 1},cube,kanaG`;
user+=`\n${base + userNum + 2},we,kanaW`;
session+=`\n${base + userNum + 0},nitro,${base + userNum + 0},2000-01-01 00:00:00`;
session+=`\n${base + userNum + 1},dol,${base + userNum + 1},2000-01-01 00:00:00`;
session+=`\n${base + userNum + 2},rev,${base + userNum + 2},2000-01-01 00:00:00`;
group+=`\n${base + groupNum + secondaryNum + 0},2004,white`;
group+=`\n${base + groupNum + secondaryNum + 1},2001,blue`;
group+=`\n${base + groupNum + secondaryNum + 2},2006,whiteonly`;
group_member+=`\n${base + groupNum + secondaryNum + 0},${base + userNum + 0},1`;
group_member+=`\n${base + groupNum + secondaryNum + 1},${base + userNum + 0},0`;
group_member+=`\n${base + groupNum + secondaryNum + 1},${base + userNum + 1},1`;
group_member+=`\n${base + groupNum + secondaryNum + 2},${base + userNum + 2},1`;
category_group+=`\n${base + groupNum + secondaryNum + 0},1,${base + groupNum + secondaryNum + 0}`;
category_group+=`\n${base + groupNum + secondaryNum + 0},2,${base + groupNum + secondaryNum + 0}`;
category_group+=`\n${base + groupNum + secondaryNum + 1},3,${base + groupNum + secondaryNum + 1}`;

console.log('out');
try {
  fs.writeFileSync(`${dirName}user.csv`, user);
  fs.writeFileSync(`${dirName}session.csv`, session);
  fs.writeFileSync(`${dirName}category.csv`, category);
  fs.writeFileSync(`${dirName}group.csv`, group);
  fs.writeFileSync(`${dirName}category_group.csv`, category_group);
  fs.writeFileSync(`${dirName}group_member.csv`, group_member);
}
catch(e) {
  console.log(e.message);
}
