/*
	Raspberry Pi (1) is used to manage the ip camera and motion detection
	Raspberry Pi (2) is used to manage the toy server
*/

typedef struct CONFIG{
	char* ip_rpi_cam;			//ip address of (1)
	char* ip_rpi_toy;			//ip address of (2)
	char* port_cam;				//port to see the video from (1)
	char* port_toy;				//port to see the application from (2)
	char* port_rpi_toy;			//port to connect to (1)
	char* port_rpi_cam;			//port to connect to (2)
	char* pwd_rpi_cam;			//password to access to (1)
	char* pwd_rpi_toy;			//password to access to (2) 
	char* path_record;			//location for remote record
} *Config;

void complete_configuration(const char* missing_conf);
void choose_configuration();
int get_new_configuration(const char* key);

void add_in_file(const char* key, const char* value);
void override_in_file(const char* key, const char* value);
char* read_in_file(const char* key);

void show_config_file();
void load_config();
void reload_config();
char* check_config();

void stop_server();
void start_server();

void start_video_record();
void stop_video_record();

void take_snap();