#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "main.h"

Config config;
bool debug = false;

int main(int argc, char** argv){

	int mode;
	char* missing_conf;

	if(argc >= 2){
		if(strcmp(argv[1],"true") || strcmp(argv[1],"debug")){
			printf("Debug mode active\n");
			debug = true;
		}
	}

	load_config();
	
	while((missing_conf=check_config()) != ""){
		complete_configuration(missing_conf);
	}

	while(1){
	
 		printf("[0] Configuration\n");
		printf("[1] Launch Application Server\n");
		printf("[2] Stop Application Server\n");
		printf("[3] Take a snap\n");
		printf("[4] Take a video\n");
		
		scanf("%d",&mode);
		system("clear");
		
		switch(mode){	
			case 0 : choose_configuration();
				break;
			case 1 : start_server();
				break;
			case 2 : stop_server();
				break;
			case 3 : take_snap();
				break;
			case 4 : start_video_record();
				break;
			default:;
		}
	}
	
	return 0;
}


/**
*	Start remote application server
**/
void start_server(){
	printf("Server Starting\n");
	char command[512] = "";
	strcat(command,"sudo sshpass -p '");
	strcat(command,config->pwd_rpi_toy);
	strcat(command,"' ssh pi@");
	strcat(command,config->ip_rpi_toy);
	strcat(command," -p ");
	strcat(command,config->port_rpi_toy);
	if(debug){
		strcat(command," -o StrictHostKeyChecking=no 'sudo /home/pi/PlayStationCat/bash/toy_server.sh start --showlog'");
		printf("Commande : %s\n", command);
	} else
		strcat(command," -o StrictHostKeyChecking=no 'sudo /home/pi/PlayStationCat/bash/toy_server.sh start'");
	system(command);
	printf("Server Started\n");
}


/**
*	Stop remote application server
**/
void stop_server(){
	printf("Server Stopping\n");
	char command[512] = "";
	strcat(command,"sudo sshpass -p '");
	strcat(command,config->pwd_rpi_toy);
	strcat(command,"' ssh pi@");
	strcat(command,config->ip_rpi_toy);
	strcat(command," -p ");
	strcat(command,config->port_rpi_toy);
	strcat(command," -o StrictHostKeyChecking=no 'sudo /home/pi/PlayStationCat/bash/toy_server.sh stop'");
	if(debug){
		printf("Commande : %s\n", command);
	}
	system(command);
	printf("Server Stopped\n");
}


/**
*	Take a video record with the remote ip camera
**/
void start_video_record(){
	char duration[9];
	printf("Set the duration of the record.\n");
	scanf("%s",duration);
	char command[512] = "";

	strcat(command,"sudo sshpass -p '");
	strcat(command,config->pwd_rpi_cam);
	strcat(command,"' ssh pi@");
	strcat(command,config->ip_rpi_cam);
	strcat(command," -p ");
	strcat(command,config->port_rpi_cam);
	strcat(command," -o StrictHostKeyChecking=no '/home/pi/PlayStationCat/bash/cam_server.sh rec http://");
	strcat(command,config->ip_cam);
	strcat(command,":");
	strcat(command,config->port_cam);
	strcat(command,"/video ");
	strcat(command,config->path_record);
	strcat(command," movie ");
	strcat(command,duration);
	if(debug){
		strcat(command," true'");
		printf("Commande : %s\n", command);
	} else {
		strcat(command," true > mov.log 2>&1'");
	}
	system(command);

	char command2[512] = "";
	strcat(command2,"wget -A avi -m -nd ");
	strcat(command2,config->ip_rpi_cam);
	if(debug){
		strcat(command2,"/todl > downloads.log");
		printf("Commande : %s\n", command2);
	} else {
		strcat(command2,"/todl > downloads.log 2>&1");
	}
	system(command2);

	char command3[512] = "";
	strcat(command3,"sudo sshpass -p '");
	strcat(command3,config->pwd_rpi_cam);
	strcat(command3,"' ssh pi@");
	strcat(command3,config->ip_rpi_cam);
	strcat(command3," -p ");
	strcat(command3,config->port_rpi_cam);
	if(debug){
		strcat(command3," 'rm /var/www/todl/*'");
		printf("Commande : %s\n", command3);
	} else {
		strcat(command3," 'rm /var/www/todl/* > mov.log 2>&1'");
	}
	system(command3);
}


/**
*	Take a snap with the remote ip camera
**/
void take_snap(){
	char command[512] = "";
	strcat(command,"sudo sshpass -p '");
	strcat(command,config->pwd_rpi_cam);
	strcat(command,"' ssh pi@");
	strcat(command,config->ip_rpi_cam);
	strcat(command," -p ");
	strcat(command,config->port_rpi_cam);
	strcat(command," -o StrictHostKeyChecking=no '/home/pi/PlayStationCat/bash/cam_server.sh snap http://");
	strcat(command,config->ip_cam);
	strcat(command,":");
	strcat(command,config->port_cam);
	strcat(command,"/video ");
	strcat(command,config->path_record);
	if(debug){
		strcat(command," true'");
		printf("Commande : %s\n", command);
	} else {
		strcat(command," true > pic.log 2>&1'");
	}
	system(command);

	char command2[512] = "";
	strcat(command2,"wget -A png -m -nd ");
	strcat(command2,config->ip_rpi_cam);
	if(debug){
		strcat(command2,"/todl > downloads.log");
		printf("Commande : %s\n", command2);
	} else {
		strcat(command2,"/todl > downloads.log 2>&1");
	}
	system(command2);

	char command3[512] = "";
	strcat(command3,"sudo sshpass -p '");
	strcat(command3,config->pwd_rpi_cam);
	strcat(command3,"' ssh pi@");
	strcat(command3,config->ip_rpi_cam);
	strcat(command3," -p ");
	strcat(command3,config->port_rpi_cam);
	if(debug){
		strcat(command3," 'rm /var/www/todl/*'");
		printf("Commande : %s\n", command3);
	} else {
		strcat(command3," 'rm /var/www/todl/* > pic.log 2>&1'");
	}
	system(command3);

	printf("Snap took\n");
}


/**
*	#not_used
*	Add a key and its value in configuration file
**/
void add_in_file(const char* key, const char* value){
	FILE *config_file = fopen("pscat.conf", "a+");
	fprintf(config_file, "%s:%s\n", key, value);
	fclose(config_file);
}


/**
*	Override value for a given key in configuration file
**/
void override_in_file(const char* key, const char* value){
	FILE *config_file = fopen("pscat.conf", "a+");
	FILE *config_file2 = fopen("pscat.conf.tmp", "w");
	
	char line[600];

	while(fgets(line,600,config_file)!=NULL){
		if(strstr(line,key)==NULL){
			fputs(line,config_file2);
		}
	}
	fclose(config_file2);
	fclose(config_file);

	rename("pscat.conf.tmp", "pscat.conf"); 

	config_file = fopen("pscat.conf", "a+");
	fprintf(config_file, "%s:%s\n", key, value);
	fclose(config_file);

}


/**
*	Allow to update configuration
**/
void choose_configuration(){

	printf("ip_rpi_cam == \"%s\".\nChange ? n/Y/q (NO, yes, quit configuration)\n",config->ip_rpi_cam);
	if(get_new_configuration("ip_rpi_cam")==-1)
		return;
	printf("ip_rpi_toy == \"%s\".\nChange ? n/Y/q (NO, yes, quit configuration)\n",config->ip_rpi_toy);
	if(get_new_configuration("ip_rpi_toy")==-1)
		return;
	printf("ip_cam == \"%s\".\nChange ? n/Y/q (NO, yes, quit configuration)\n",config->ip_cam);
	if(get_new_configuration("ip_cam")==-1)
		return;
	printf("port_cam == \"%s\".\nChange ? n/Y/q (NO, yes, quit configuration)\n",config->port_cam);
	if(get_new_configuration("port_cam")==-1)
		return;
	printf("port_toy == \"%s\".\nChange ? n/Y/q (NO, yes, quit configuration)\n",config->port_toy);
	if(get_new_configuration("port_toy")==-1)
		return;
	printf("port_rpi_toy == \"%s\".\nChange ? n/Y/q (NO, yes, quit configuration)\n",config->port_rpi_toy);
	if(get_new_configuration("port_rpi_toy")==-1)
		return;
	printf("port_rpi_cam == \"%s\".\nChange ? n/Y/q (NO, yes, quit configuration)\n",config->port_rpi_cam);
	if(get_new_configuration("port_rpi_cam")==-1)
		return;
	printf("pwd_rpi_toy == \"%s\".\nChange ? n/Y/q (NO, yes, quit configuration)\n",config->pwd_rpi_toy);
	if(get_new_configuration("pwd_rpi_toy")==-1)
		return;
	printf("pwd_rpi_cam == \"%s\".\nChange ? n/Y/q (NO, yes, quit configuration)\n",config->pwd_rpi_cam);
	if(get_new_configuration("pwd_rpi_cam")==-1)
		return;
	printf("path_record == \"%s\".\nChange ? n/Y/q (NO, yes, quit configuration)\n",config->path_record);
	if(get_new_configuration("path_record")==-1)
		return;
}


/**
*	User can edit, ignore, or quit configuration
**/
int get_new_configuration(const char* key){
	char newval[512];
	char c[1];
	scanf("%s",c);
	system("clear");
	if(strstr("q",c) || strstr("Q",c) || strstr("quit",c) || strstr("Quit",c) || strstr("QUIT",c)) {
		return -1;
	} else if (strstr("Y",c) || strstr("y",c) || strstr("yes",c) || strstr("Yes",c) || strstr("YES",c)) {
		printf("Enter a not empty new value for %s\n",key);
		do{
			scanf("%s",newval);
			system("clear");
		} while (strlen(newval)<=0);
		override_in_file(key,newval);
	}
}


/**
*	Complete the configuration if field is missing
**/
void complete_configuration(const char* missing_conf){

	printf("Set %s\n",missing_conf);

	if(missing_conf == "ip_rpi_cam") {
		scanf("%s",config->ip_rpi_cam);
		override_in_file(missing_conf,config->ip_rpi_cam);
	} else if(missing_conf == "ip_rpi_toy") {
		scanf("%s",config->ip_rpi_toy);
		override_in_file(missing_conf,config->ip_rpi_toy);
	} else if(missing_conf == "ip_cam") {
		scanf("%s",config->ip_cam);
		override_in_file(missing_conf,config->ip_cam);
	}  else if(missing_conf == "port_cam") {
		scanf("%s",config->port_cam);
		override_in_file(missing_conf,config->port_cam);
	} else if(missing_conf == "port_toy") {
		scanf("%s",config->port_toy);
		override_in_file(missing_conf,config->port_toy);
	} else if(missing_conf == "port_rpi_toy") {
		scanf("%s",config->port_rpi_toy);
		override_in_file(missing_conf,config->port_rpi_toy);
	} else if(missing_conf == "port_rpi_cam") {
		scanf("%s",config->port_rpi_cam);
		override_in_file(missing_conf,config->port_rpi_cam);
	} else if(missing_conf == "pwd_rpi_toy") {
		scanf("%s",config->pwd_rpi_toy);
		override_in_file(missing_conf,config->pwd_rpi_toy);
	} else if(missing_conf == "pwd_rpi_cam") {
		scanf("%s",config->pwd_rpi_cam);
		override_in_file(missing_conf,config->pwd_rpi_cam);
	} else if(missing_conf == "path_record") {
		scanf("%s",config->path_record);
		override_in_file(missing_conf,config->path_record);
	}

	reload_config();
}


/**
*	Reload configuration
**/
void reload_config(){
	load_config();
}


/**
*	Load configuration
**/
void load_config(){
	config = (Config)malloc(sizeof(struct CONFIG));

	config->ip_rpi_cam = read_in_file("ip_rpi_cam");
	config->ip_rpi_toy = read_in_file("ip_rpi_toy");
	config->ip_cam = read_in_file("ip_cam");
	config->port_cam = read_in_file("port_cam");
	config->port_toy = read_in_file("port_toy");
	config->port_rpi_toy = read_in_file("port_rpi_toy");
	config->port_rpi_cam = read_in_file("port_rpi_cam");
	config->pwd_rpi_toy = read_in_file("pwd_rpi_toy");
	config->pwd_rpi_cam = read_in_file("pwd_rpi_cam");
	config->path_record = read_in_file("path_record");
}


/**
*	Check if the configuration file is complete
*	Return "" if it is, or the name of the missing configuration
**/
char* check_config(){
	if(strlen(config->ip_rpi_cam) == 0)
		return "ip_rpi_cam";
	if(strlen(config->ip_rpi_toy) == 0)
		return "ip_rpi_toy";
	if(strlen(config->ip_cam) == 0)
		return "ip_cam";
	if(strlen(config->port_cam) == 0)
		return "port_cam";
	if(strlen(config->port_toy) == 0)
		return "port_toy";
	if(strlen(config->port_rpi_toy) == 0)
		return "port_rpi_toy";
	if(strlen(config->port_rpi_cam) == 0)
		return "port_rpi_cam";
	if(strlen(config->pwd_rpi_toy) == 0)
		return "pwd_rpi_toy";
	if(strlen(config->pwd_rpi_cam) == 0)
		return "pwd_rpi_cam";
	if(strlen(config->path_record) == 0)
		return "path_record";

	return "";
}


/**
*	Read and return the value relative to the given key
**/
char* read_in_file(const char* key){
	FILE *config_file = fopen("pscat.conf", "r");
	char line[600];
	char* tmp = (char*)malloc(512*sizeof(char));
	char* res = (char*)malloc(512*sizeof(char));
	while(fgets(line,600,config_file)!=NULL){
		if(strstr(line,key)){
			strtok_r (line, ":", &tmp);
			break;
		}
	}
	fclose(config_file);
	strncpy(res,tmp,strlen(tmp)-1);
	return res+'\0';
}


/**
*	#not_used
*	Show configuration file
**/
void show_config_file(){
	FILE *config_file = fopen("pscat.conf", "r");
	char line[600];
	while(fgets(line,600,config_file)!=NULL){
		printf("%s",line);
	}
	fclose(config_file);
}
